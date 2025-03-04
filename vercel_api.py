from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import json
import requests

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def get_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api-key-status")
async def api_key_status():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return JSONResponse(content={"status": "missing"})
    return JSONResponse(content={"status": "available"})

@app.post("/analyze")
async def analyze_finances(request: Request):
    try:
        # Get the request body
        body = await request.json()
        
        # Check for API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return JSONResponse(content={"success": False, "error": "OpenAI API key is not set"})
        
        # Format the financial data
        income = body.get("income", 0)
        expenses = body.get("expenses", {})
        debts = body.get("debts", {})
        savings_goal = body.get("savings_goal", 0)
        
        financial_info = f"""
        Monthly Income: ${income}
        Monthly Expenses: Rent: ${expenses.get('rent', 0)}, Utilities: ${expenses.get('utilities', 0)}, 
        Groceries: ${expenses.get('groceries', 0)}, Transportation: ${expenses.get('transportation', 0)}, 
        Entertainment: ${expenses.get('entertainment', 0)}, Other: ${expenses.get('other', 0)}
        Debts: Credit Card: ${debts.get('credit_card', {}).get('balance', 0)} at {float(debts.get('credit_card', {}).get('interest_rate', 0)) * 100}%, 
        Student Loan: ${debts.get('student_loan', {}).get('balance', 0)} at {float(debts.get('student_loan', {}).get('interest_rate', 0)) * 100}%
        Monthly Savings Goal: ${savings_goal}
        """
        
        # Create the prompt
        prompt = f"""
        As a financial advisor, analyze this data and provide a budget plan with actual values (no placeholders):
        {financial_info}
        Include: 1) Expense breakdown with percentages 2) Optimization recommendations 
        3) Savings plan 4) Debt advice 5) Investment tips 6) Actionable steps
        """
        
        # Call the OpenAI API directly with requests
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a financial advisor. Use actual numerical values, never placeholders like '$X'."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            return JSONResponse(content={"success": True, "result": content})
        else:
            return JSONResponse(content={"success": False, "error": f"OpenAI API error: {response.text}"})
    
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}) 