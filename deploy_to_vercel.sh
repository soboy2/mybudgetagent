#!/bin/bash

echo "Preparing for Vercel deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Create a clean deployment directory
echo "Creating clean deployment directory..."
mkdir -p vercel_deploy
cp -r templates vercel_deploy/
cp -r static vercel_deploy/
cp vercel.json vercel_deploy/
cp vercel_api.py vercel_deploy/api.py
cp vercel_requirements.txt vercel_deploy/requirements.txt

# Create a .vercelignore file to exclude unnecessary files
echo "Creating .vercelignore file..."
cat > vercel_deploy/.vercelignore << EOL
__pycache__
*.pyc
.env
.git
.github
.gitignore
.venv
env
venv
*.backup
*.log
*.md
tests
node_modules
EOL

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