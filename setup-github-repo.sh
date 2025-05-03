#!/bin/bash

# This script helps initialize a GitHub repository for the OpenAI Image Compare project
# and prepares it for GitHub Pages deployment

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}GitHub Repository Setup for OpenAI Image Compare${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if the directory is already a git repository
if [ -d .git ]; then
    echo -e "${RED}This directory is already a git repository.${NC}"
    echo -e "${BLUE}You can push to GitHub with:${NC}"
    echo -e "git remote add origin https://github.com/YOUR_USERNAME/openai-image-compare.git"
    echo -e "git push -u origin main"
    exit 1
fi

# Initialize git repository
echo -e "${GREEN}Initializing git repository...${NC}"
git init

# Add all files
echo -e "${GREEN}Adding files to repository...${NC}"
git add .

# Initial commit
echo -e "${GREEN}Creating initial commit...${NC}"
git commit -m "Initial commit: OpenAI Image Compare application"

echo -e "${GREEN}Repository initialized successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Create a new repository on GitHub named 'openai-image-compare'"
echo -e "2. Run the following commands to push to GitHub:"
echo -e "   git remote add origin https://github.com/YOUR_USERNAME/openai-image-compare.git"
echo -e "   git branch -M main"
echo -e "   git push -u origin main"
echo -e "3. Go to your repository settings on GitHub and enable GitHub Pages"
echo -e "   - Navigate to Settings > Pages"
echo -e "   - Select 'GitHub Actions' as the source"
echo -e "4. Your site will be deployed automatically at https://YOUR_USERNAME.github.io/openai-image-compare"
echo -e "${BLUE}========================================${NC}"
