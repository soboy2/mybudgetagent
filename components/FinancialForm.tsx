import React, { useState } from 'react';

interface FinancialFormProps {
  setIsLoading: (isLoading: boolean) => void;
  setResult: (result: string | null) => void;
  setError: (error: string | null) => void;
  apiKeyMissing: boolean;
}

export const FinancialForm: React.FC<FinancialFormProps> = ({
  setIsLoading,
  setResult,
  setError,
  apiKeyMissing,
}) => {
  const [formData, setFormData] = useState({
    income: '',
    expenses: '',
    savings: '',
    debt: '',
    goals: '',
    timeframe: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/financial-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get financial advice');
      }

      setResult(data.advice);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (apiKeyMissing) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 mb-6 border border-yellow-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">API Key Missing</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please set your OpenAI API key in the .env.local file to use this application.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Please provide your financial details to get personalized advice
        </p>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="income" className="block text-sm font-medium text-gray-700">
                  Monthly Income (after tax)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="income"
                    id="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="$5,000"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="expenses" className="block text-sm font-medium text-gray-700">
                  Monthly Expenses
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="expenses"
                    id="expenses"
                    value={formData.expenses}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="$3,000"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="savings" className="block text-sm font-medium text-gray-700">
                  Current Savings
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="savings"
                    id="savings"
                    value={formData.savings}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="$10,000"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="debt" className="block text-sm font-medium text-gray-700">
                  Current Debt
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="debt"
                    id="debt"
                    value={formData.debt}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="$15,000"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                  Financial Goals
                </label>
                <div className="mt-1">
                  <textarea
                    id="goals"
                    name="goals"
                    rows={3}
                    value={formData.goals}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Buy a house, save for retirement, pay off student loans, etc."
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                  Timeframe
                </label>
                <div className="mt-1">
                  <select
                    id="timeframe"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a timeframe</option>
                    <option value="short">Short-term (1-2 years)</option>
                    <option value="medium">Medium-term (3-5 years)</option>
                    <option value="long">Long-term (5+ years)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Financial Advice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 