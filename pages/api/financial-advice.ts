import type { NextApiRequest, NextApiResponse } from 'next';

type RequestData = {
  income: string;
  expenses: string;
  savings: string;
  debt: string;
  goals: string;
  timeframe: string;
};

type ResponseData = {
  advice?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { income, expenses, savings, debt, goals, timeframe } = req.body as RequestData;

  // Validate required fields
  if (!income || !expenses || !savings || !debt || !goals || !timeframe) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // For demonstration purposes, we'll return a static response
    // In a real application, you would call the OpenAI API here
    const advice = `
# Financial Analysis and Recommendations

## Current Financial Snapshot
- Monthly Income: ${income}
- Monthly Expenses: ${expenses}
- Current Savings: ${savings}
- Current Debt: ${debt}
- Timeframe: ${timeframe === 'short' ? 'Short-term (1-2 years)' : timeframe === 'medium' ? 'Medium-term (3-5 years)' : 'Long-term (5+ years)'}

## Goals
${goals}

## Budget Analysis
Based on the information provided, here's a breakdown of your financial situation:

- Your monthly surplus (income - expenses): $${parseInt(income.replace(/[^0-9]/g, '')) - parseInt(expenses.replace(/[^0-9]/g, ''))}
- Debt-to-Income Ratio: ${Math.round((parseInt(debt.replace(/[^0-9]/g, '')) / (parseInt(income.replace(/[^0-9]/g, '')) * 12)) * 100)}%
- Emergency Fund Status: ${parseInt(savings.replace(/[^0-9]/g, '')) > parseInt(expenses.replace(/[^0-9]/g, '')) * 3 ? 'Good (3+ months)' : 'Needs improvement (less than 3 months)'}

## Recommendations

### Debt Management
${parseInt(debt.replace(/[^0-9]/g, '')) > 0 ? `
- Consider using the debt snowball or avalanche method to pay down your debt
- Allocate at least 20% of your surplus toward debt repayment
- Look into refinancing options if you have high-interest debt
` : 'You have no debt, which is excellent!'}

### Savings Strategy
- Aim to save at least 20% of your income each month
- Build an emergency fund covering 3-6 months of expenses
- Consider automating your savings to ensure consistency

### Investment Opportunities
${timeframe === 'long' ? `
- For long-term goals, consider index funds or ETFs for steady growth
- Maximize contributions to retirement accounts like 401(k) or IRA
- Diversify your investments across different asset classes
` : timeframe === 'medium' ? `
- For medium-term goals, consider a mix of bonds and conservative stock investments
- Look into high-yield savings accounts or CDs for funds you'll need in 3-5 years
- Start building a diversified portfolio with a moderate risk profile
` : `
- For short-term goals, focus on liquidity and capital preservation
- Consider high-yield savings accounts, money market accounts, or short-term CDs
- Avoid high-risk investments for money you'll need within 1-2 years
`}

### Next Steps
1. Create a detailed monthly budget tracking all income and expenses
2. Set specific, measurable financial goals with deadlines
3. Review and adjust your financial plan quarterly
4. Consider consulting with a financial advisor for personalized guidance

This analysis is based on the information provided and serves as general guidance. For personalized financial advice, please consult with a certified financial planner.
`;

    return res.status(200).json({ advice });
  } catch (error) {
    console.error('Error generating financial advice:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    });
  }
} 