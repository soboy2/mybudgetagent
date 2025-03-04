#!/bin/bash

echo "Preparing for Vercel deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Create a clean deployment directory
echo "Creating clean deployment directory..."
rm -rf vercel_deploy
mkdir -p vercel_deploy

# Copy only the essential files
cp api.py vercel_deploy/
cp requirements.txt vercel_deploy/
cp vercel.json vercel_deploy/

# Change to the deployment directory
cd vercel_deploy

# Deploy to Vercel with production flag
echo "Deploying to Vercel..."
vercel --prod

# Return to the original directory
cd ..

# Clean up
echo "Cleaning up..."
rm -rf vercel_deploy

echo "Deployment complete! Don't forget to set your OPENAI_API_KEY in the Vercel dashboard." 