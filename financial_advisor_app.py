from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set. Please set it in your .env file.")

# Initialize the LLM
openai = ChatOpenAI(
    api_key=api_key,
    model="gpt-4",
    temperature=0.7
)

# Create Agents
budgeting_advisor = Agent(
    role='Budgeting Advisor',
    goal='Help clients create and optimize their budget',
    backstory="""You are an experienced budgeting advisor with expertise in 
    personal finance management. You help people understand their spending patterns 
    and create sustainable budgets. You also provide advice on savings, debt management,
    and investment strategies as part of a comprehensive financial plan.""",
    verbose=True,
    allow_delegation=False,
    llm=openai
)

# Create Tasks
budget_analysis_task = Task(
    description="""Analyze the client's monthly income and expenses. 
    Create a detailed budget plan that includes essential expenses, 
    discretionary spending, and savings goals. Also provide basic advice on
    debt management and investment strategies as part of a comprehensive financial plan.""",
    agent=budgeting_advisor,
    expected_output="""A detailed budget analysis including:
    - Breakdown of current expenses
    - Recommendations for expense optimization
    - Savings plan to meet the monthly savings goal
    - Basic debt management advice
    - Simple investment recommendations
    - Specific actionable steps to improve financial health"""
)

# Create and run the crew
financial_crew = Crew(
    agents=[budgeting_advisor],
    tasks=[budget_analysis_task],
    verbose=True
)

# user financial data
user_financial_data = {
    "income": 5000,  # Monthly income in dollars
    "expenses": {
        "rent": 1500,
        "utilities": 300,
        "groceries": 400,
        "transportation": 200,
        "entertainment": 150,
        "other": 450
    },
    "debts": {
        "credit_card": {
            "balance": 2000,
            "interest_rate": 0.18  # 18% interest rate
        },
        "student_loan": {
            "balance": 15000,
            "interest_rate": 0.045  # 4.5% interest rate
        }
    },
    "savings_goal": 500  # Monthly savings goal in dollars
}

# Only execute if this file is run directly
if __name__ == "__main__":
    # Execute the financial analysis
    result = financial_crew.kickoff(inputs=user_financial_data)
    print("Financial Analysis Results:")
    print(result) 



