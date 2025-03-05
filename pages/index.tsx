import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FinancialForm } from '../components/FinancialForm';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Home() {
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check API key status on page load
    fetch('/api/api-key-status')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'missing') {
          setApiKeyMissing(true);
        }
      })
      .catch(error => {
        console.error('Error checking API key status:', error);
      });
  }, []);

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>Budget Agent - AI-Powered Financial Advisor</title>
        <meta name="description" content="Get personalized financial advice powered by AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Budget Agent</h1>
              </div>
            </div>
            <div className="flex items-center">
              {/* GitHub icon removed */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI-Powered Financial Advisor
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Get personalized financial advice based on your income, expenses, and goals.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : result ? (
          <ResultsDisplay result={result} resetForm={resetForm} />
        ) : (
          <FinancialForm
            setIsLoading={setIsLoading}
            setResult={setResult}
            setError={setError}
            apiKeyMissing={apiKeyMissing}
          />
        )}
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Budget Agent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 