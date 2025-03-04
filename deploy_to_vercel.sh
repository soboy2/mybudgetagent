#!/bin/bash

echo "Preparing for Vercel deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Backup original files
echo "Backing up original files..."
cp api.py api.py.backup
cp requirements.txt requirements.txt.backup

# Use optimized files for Vercel
echo "Using optimized files for Vercel deployment..."
cp vercel_api.py api.py
cp vercel_requirements.txt requirements.txt

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Restore original files
echo "Restoring original files..."
mv api.py.backup api.py
mv requirements.txt.backup requirements.txt

echo "Deployment complete! Don't forget to set your OPENAI_API_KEY in the Vercel dashboard." 