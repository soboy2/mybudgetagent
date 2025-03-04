# Budget Agent - AI-Powered Financial Advisor

Budget Agent is a web application that uses AI agents to provide personalized financial advice. The application analyzes your financial data and provides recommendations for budgeting, investment, and debt management.

## Features

- **Budgeting Analysis**: Get a detailed breakdown of your expenses and recommendations for optimization
- **Investment Planning**: Receive personalized investment strategies based on your financial situation
- **Debt Management**: Get a comprehensive debt management plan with prioritization and repayment strategies

## Technology Stack

- **Backend**: Python with FastAPI
- **AI Framework**: CrewAI with OpenAI's GPT-4
- **Frontend**: HTML, CSS, JavaScript with Alpine.js and Tailwind CSS

## Installation

1. Clone the repository
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Set up your OpenAI API key in a `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

1. Start the server:
   ```
   python api.py
   ```
2. Open your browser and navigate to `http://localhost:8000`
3. Enter your financial information and click "Analyze My Finances"
4. Wait for the AI agents to analyze your data (this may take a minute or two)
5. Review the comprehensive financial advice provided by the AI agents

## Deployment to Vercel

To deploy this application to Vercel:

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Run the following command in the project directory:
   ```
   vercel
   ```
4. Follow the prompts to complete the deployment
5. Set up your environment variables (OPENAI_API_KEY) in the Vercel dashboard

## License

MIT

## Acknowledgements

- This project uses the [CrewAI](https://github.com/joaomdmoura/crewAI) framework
- Powered by OpenAI's GPT-4 model 