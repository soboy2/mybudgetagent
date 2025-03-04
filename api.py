from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Dict
import os
import openai

app = FastAPI()

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
            return JSONResponse(content={"success": False, "error": "OpenAI API key is not set"})
        
        # Initialize OpenAI client
        client = openai.OpenAI(api_key=api_key)
        
        # Format the financial data
        financial_info = f"""
        Monthly Income: ${data.income}
        Monthly Expenses: Rent: ${data.expenses.get('rent', 0)}, Utilities: ${data.expenses.get('utilities', 0)}, 
        Groceries: ${data.expenses.get('groceries', 0)}, Transportation: ${data.expenses.get('transportation', 0)}, 
        Entertainment: ${data.expenses.get('entertainment', 0)}, Other: ${data.expenses.get('other', 0)}
        Debts: Credit Card: ${data.debts.get('credit_card', {}).get('balance', 0)} at {data.debts.get('credit_card', {}).get('interest_rate', 0) * 100}%, 
        Student Loan: ${data.debts.get('student_loan', {}).get('balance', 0)} at {data.debts.get('student_loan', {}).get('interest_rate', 0) * 100}%
        Monthly Savings Goal: ${data.savings_goal}
        """
        
        # Create the prompt
        prompt = f"""
        As a financial advisor, analyze this data and provide a budget plan with actual values (no placeholders):
        {financial_info}
        Include: 1) Expense breakdown with percentages 2) Optimization recommendations 
        3) Savings plan 4) Debt advice 5) Investment tips 6) Actionable steps
        """
        
        # Call the OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a financial advisor. Use actual numerical values, never placeholders like '$X'."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Return the analysis
        return JSONResponse(content={"success": True, "result": response.choices[0].message.content})
    
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}) 