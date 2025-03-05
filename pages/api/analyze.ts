import type { NextApiRequest, NextApiResponse } from 'next';

type RequestData = {
  income: string;
  expenses?: string;
  debts?: string;
  goals?: string;
};

type ResponseData = {
  success: boolean;
  result?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { income, expenses, debts, goals } = req.body as RequestData;

  if (!income) {
    return res.status(400).json({ success: false, error: 'Income is required' });
  }

  try {
    // For demonstration purposes, we'll return a static response
    // In a real application, you would call the OpenAI API here
    return res.status(200).json({
      success: true,
      result: `
# Budget Analysis

Based on your financial information, here's a detailed budget analysis:

## Income and Expense Breakdown
- Monthly Income: $${income} (100%)
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
`
    });
  } catch (error) {
    console.error('Error analyzing finances:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    });
  }
} 