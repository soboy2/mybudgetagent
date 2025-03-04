from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = FastAPI(title="Budget Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create templates directory
os.makedirs("templates", exist_ok=True)
templates = Jinja2Templates(directory="templates")

# Create static directory
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

class FinancialData(BaseModel):
    income: float
    expenses: Dict[str, float]
    debts: Dict[str, Dict[str, float]]
    savings_goal: float

@app.get("/", response_class=HTMLResponse)
async def get_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api-key-status")
async def api_key_status():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        return {"status": "missing", "message": "OpenAI API key is not set. Please set it in your .env file."}
    return {"status": "ok", "message": "OpenAI API key is set."}

@app.post("/analyze")
async def analyze_finances(data: FinancialData):
    try:
        # Check if API key is set
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": "OpenAI API key is not set. Please set it in your .env file."
                }
            )
        
        # Import here to avoid loading the module if API key is not set
        from financial_advisor_app import financial_crew
        
        # Convert the Pydantic model to a dictionary
        user_financial_data = data.dict()
        
        # Process the data using the financial crew
        result = financial_crew.kickoff(inputs=user_financial_data)
        
        # Ensure result is a string
        if not isinstance(result, str):
            result = str(result)
            
        return {"success": True, "result": result}
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error in analyze_finances: {str(e)}\n{error_details}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 