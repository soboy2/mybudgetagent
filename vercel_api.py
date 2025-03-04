from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import os
import openai
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = FastAPI(title="Budget Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Define data model
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
    if not api_key:
        return {"status": "missing"}
    return {"status": "available"}

@app.post("/analyze")
async def analyze_finances(data: FinancialData):
    try:
        # Check for API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "OpenAI API key is not set. Please set it in your .env file."}
            )
        
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Format the financial data for the prompt
        financial_info = f"""
        Monthly Income: ${data.income}
        
        Monthly Expenses:
        - Rent: ${data.expenses.get('rent', 0)}
        - Utilities: ${data.expenses.get('utilities', 0)}
        - Groceries: ${data.expenses.get('groceries', 0)}
        - Transportation: ${data.expenses.get('transportation', 0)}
        - Entertainment: ${data.expenses.get('entertainment', 0)}
        - Other: ${data.expenses.get('other', 0)}
        
        Debts:
        - Credit Card: Balance ${data.debts.get('credit_card', {}).get('balance', 0)}, Interest Rate {data.debts.get('credit_card', {}).get('interest_rate', 0) * 100}%
        - Student Loan: Balance ${data.debts.get('student_loan', {}).get('balance', 0)}, Interest Rate {data.debts.get('student_loan', {}).get('interest_rate', 0) * 100}%
        
        Monthly Savings Goal: ${data.savings_goal}
        """
        
        # Create the prompt for GPT
        prompt = f"""
        You are a comprehensive financial advisor with expertise in budgeting, investment, and debt management.
        
        Analyze the following financial information and provide a detailed financial plan:
        
        {financial_info}
        
        Your analysis should include:
        1. A breakdown of current expenses and their percentage of total income
        2. Recommendations for expense optimization
        3. A savings plan to meet the monthly savings goal
        4. Basic debt management advice
        5. Simple investment recommendations
        6. Specific actionable steps to improve financial health
        
        IMPORTANT: Use the ACTUAL VALUES from the financial information provided. DO NOT use placeholders like "$X" in your response. Calculate all percentages and totals based on the actual income and expense values.
        
        For example, if the monthly income is $5000 and rent is $1500, say "Rent: $1500 (30% of income)" NOT "Rent: $X".
        
        Format your response in a clear, organized manner with headings and bullet points where appropriate.
        """
        
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a financial advisor AI assistant. Always use actual numerical values in your analysis, never placeholders like '$X'."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract the result
        result = response.choices[0].message.content
        
        # Return the analysis
        return {"success": True, "result": result}
    
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"An error occurred: {str(e)}"}
        )

if __name__ == "__main__":
    uvicorn.run("vercel_api:app", host="0.0.0.0", port=8000, reload=True) 