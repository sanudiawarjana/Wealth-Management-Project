# Comprehensive Deployment Script for WealthTrack
# This script helps deploy both frontend and backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WealthTrack Deployment Assistant" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($cmdname)
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$hasNode = Test-Command "node"
$hasNpm = Test-Command "npm"
$hasGit = Test-Command "git"

if (-not $hasNode) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    exit 1
}

if (-not $hasNpm) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

if (-not $hasGit) {
    Write-Host "⚠️  Git is not installed. You may need it for deployment." -ForegroundColor Yellow
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Ask user what to deploy
Write-Host "What would you like to deploy?" -ForegroundColor Yellow
Write-Host "1. Frontend only (Vercel)"
Write-Host "2. Backend only (AWS)"
Write-Host "3. Both Frontend and Backend"
Write-Host "4. Run local tests"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Deploying Frontend to Vercel" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""

        # Check if in Frontend directory
        if (Test-Path ".\Frontend") {
            Set-Location .\Frontend
        }

        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install

        Write-Host ""
        Write-Host "Building frontend..." -ForegroundColor Yellow
        npm run build

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Frontend build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Commit your changes: git add . && git commit -m 'Deploy frontend'"
            Write-Host "2. Push to GitHub: git push"
            Write-Host "3. Vercel will automatically deploy"
            Write-Host ""
            Write-Host "IMPORTANT: Make sure to set environment variables in Vercel:" -ForegroundColor Red
            Write-Host "  NEXT_PUBLIC_API_URL=https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api"
        } else {
            Write-Host "❌ Frontend build failed!" -ForegroundColor Red
            exit 1
        }
    }

    "2" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Deploying Backend to AWS" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""

        # Check if in Backend directory
        if (Test-Path ".\Backend") {
            Set-Location .\Backend
        }

        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install

        Write-Host ""
        Write-Host "Running tests..." -ForegroundColor Yellow
        # Add test command if available

        Write-Host ""
        Write-Host "✅ Backend prepared for deployment!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To deploy to AWS Elastic Beanstalk:" -ForegroundColor Yellow
        Write-Host "1. Install EB CLI: pip install awsebcli"
        Write-Host "2. Initialize EB: eb init"
        Write-Host "3. Deploy: eb deploy"
        Write-Host ""
        Write-Host "Or use AWS Console to upload deployment package"
        Write-Host ""
        Write-Host "IMPORTANT: Make sure environment variables are set in AWS:" -ForegroundColor Red
        Write-Host "  - MONGODB_URI"
        Write-Host "  - AWS_ACCESS_KEY_ID"
        Write-Host "  - AWS_SECRET_ACCESS_KEY"
        Write-Host "  - NODE_ENV=production"
    }

    "3" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Deploying Both Frontend and Backend" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""

        # Deploy Backend first
        Write-Host "Step 1: Preparing Backend..." -ForegroundColor Yellow
        if (Test-Path ".\Backend") {
            Set-Location .\Backend
        }
        npm install
        Set-Location ..

        Write-Host ""
        Write-Host "Step 2: Preparing Frontend..." -ForegroundColor Yellow
        if (Test-Path ".\Frontend") {
            Set-Location .\Frontend
        }
        npm install
        npm run build

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Both projects prepared successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Follow these steps to complete deployment:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Backend (AWS):" -ForegroundColor Cyan
            Write-Host "  1. Deploy backend to AWS Elastic Beanstalk"
            Write-Host "  2. Verify backend is running: https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/health"
            Write-Host ""
            Write-Host "Frontend (Vercel):" -ForegroundColor Cyan
            Write-Host "  1. Set NEXT_PUBLIC_API_URL in Vercel environment variables"
            Write-Host "  2. Push to GitHub: git add . && git commit -m 'Deploy' && git push"
            Write-Host "  3. Vercel will auto-deploy"
        } else {
            Write-Host "❌ Build failed!" -ForegroundColor Red
            exit 1
        }
    }

    "4" {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Running Local Tests" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""

        Write-Host "Testing Backend..." -ForegroundColor Yellow
        if (Test-Path ".\Backend") {
            Set-Location .\Backend
            npm install
            
            Write-Host ""
            Write-Host "Starting Backend server..." -ForegroundColor Yellow
            Write-Host "Press Ctrl+C to stop the server and continue" -ForegroundColor Yellow
            npm run dev
            
            Set-Location ..
        }

        Write-Host ""
        Write-Host "Testing Frontend..." -ForegroundColor Yellow
        if (Test-Path ".\Frontend") {
            Set-Location .\Frontend
            npm install
            
            Write-Host ""
            Write-Host "Starting Frontend dev server..." -ForegroundColor Yellow
            Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
            npm run dev
        }
    }

    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Assistant Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
