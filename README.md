# Budget Agent - AI-Powered Financial Advisor

Budget Agent is a web application that uses AI to provide personalized financial advice. The application analyzes your financial data and provides recommendations for budgeting, investment, and debt management.

## Features

- **Personalized Financial Analysis**: Get tailored advice based on your income, expenses, savings, and debt
- **Budgeting Recommendations**: Receive suggestions for optimizing your monthly budget
- **Investment Planning**: Get personalized investment strategies based on your financial goals and timeframe
- **Debt Management**: Receive a comprehensive debt management plan with prioritization and repayment strategies
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS
- **User-Friendly**: Simple and intuitive interface for easy navigation

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Styling**: PostCSS, Tailwind CSS
- **Content Rendering**: React Markdown for formatted financial advice
- **API Routes**: Next.js API routes for backend functionality
- **AI Integration**: OpenAI API (optional)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/soboy2/mybudgetagent.git
   cd mybudgetagent
   ```

2. Install the required packages:
   ```
   npm install
   ```

3. Set up your OpenAI API key in a `.env.local` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   Note: The application will work without an API key, but will use mock data instead of real AI-generated advice.

## Development

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter your financial information in the form and click "Get Financial Advice"

4. Review the comprehensive financial advice provided

## Building for Production

To create an optimized production build:

```
npm run build
```

To start the production server:

```
npm start
```

## Deployment

This project can be deployed to Vercel with a single command:

```
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

MIT

## Acknowledgements

- Powered by OpenAI's GPT models
- Built with Next.js and Tailwind CSS
