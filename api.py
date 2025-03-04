from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

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
        # Return a simple static response for testing
        return JSONResponse(content={
            "success": True, 
            "result": """
# Budget Analysis

Based on your financial information, here's a detailed budget analysis:

## Income and Expense Breakdown
- Monthly Income: $5,000 (100%)
- Total Expenses: $3,000 (60%)
  - Rent: $1,500 (30%)
  - Utilities: $300 (6%)
  - Groceries: $400 (8%)
  - Transportation: $200 (4%)
  - Entertainment: $150 (3%)
  - Other: $450 (9%)
- Debt Payments: $500 (10%)
- Savings: $500 (10%)
- Remaining: $1,000 (20%)

## Recommendations
1. Your housing costs are at 30% of your income, which is within the recommended range.
2. Consider reducing entertainment expenses by 20% to increase savings.
3. Allocate more funds to debt repayment to reduce interest costs.
4. Build an emergency fund of 3-6 months of expenses.

This is a static test response to verify the deployment is working correctly.
"""
        })
    
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}) 