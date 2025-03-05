import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ResultsDisplayProps {
  result: string;
  resetForm: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, resetForm }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Analysis</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your personalized financial advice
          </p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Start Over
        </button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6 prose max-w-none">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    </div>
  );
}; 