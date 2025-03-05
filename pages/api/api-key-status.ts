import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status: 'available' | 'missing';
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Check if the OpenAI API key is set in the environment variables
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      status: 'missing',
      message: 'OpenAI API key is not set in the environment variables',
    });
  }

  return res.status(200).json({
    status: 'available',
  });
} 