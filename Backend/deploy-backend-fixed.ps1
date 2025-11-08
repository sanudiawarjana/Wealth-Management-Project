# AWS Elastic Beanstalk Backend Deployment Script
# Fixes all deployment issues and deploys to AWS

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AWS Backend Deployment Fix & Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if EB CLI is installed
try {
    $ebVersion = eb --version 2>&1
    Write-Host "✅ EB CLI installed: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ EB CLI not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install EB CLI first:" -ForegroundColor Yellow
    Write-Host "  pip install awsebcli" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or follow: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Step 1: Environment Variables Setup" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  You need to set these environment variables in AWS EB:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required Environment Variables:" -ForegroundColor Cyan
Write-Host "  MONGO_URI=mongodb+srv://kchamod1124:Kavindu1124@wealthplanner.mvpovg3.mongodb.net/wealthdb?retryWrites=true&w=majority"
Write-Host "  AWS_REGION=us-east-1"
Write-Host "  AWS_ACCESS_KEY_ID=AKIAR75T6EU63O4LV32W"
Write-Host "  AWS_SECRET_ACCESS_KEY=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"
Write-Host "  BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0"
Write-Host "  ANTHROPIC_VERSION=bedrock-2023-05-31"
Write-Host "  FRONTEND_URL=https://your-app.vercel.app"
Write-Host "  NODE_ENV=production"
Write-Host "  PORT=8080"
Write-Host ""

$setEnvNow = Read-Host "Do you want to set environment variables now? (y/n)"

if ($setEnvNow -eq 'y') {
    Write-Host ""
    Write-Host "Setting environment variables..." -ForegroundColor Yellow
    
    eb setenv `
        MONGO_URI="mongodb+srv://kchamod1124:Kavindu1124@wealthplanner.mvpovg3.mongodb.net/wealthdb?retryWrites=true&w=majority" `
        AWS_REGION="us-east-1" `
        AWS_ACCESS_KEY_ID="AKIAR75T6EU63O4LV32W" `
        AWS_SECRET_ACCESS_KEY="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" `
        BEDROCK_MODEL_ID="anthropic.claude-3-sonnet-20240229-v1:0" `
        ANTHROPIC_VERSION="bedrock-2023-05-31" `
        NODE_ENV="production" `
        PORT="8080"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to set environment variables" -ForegroundColor Red
        Write-Host "You can set them manually in AWS Console" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Remember to set environment variables in AWS Console!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Step 2: Initialize EB (if needed)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path ".elasticbeanstalk\config.yml")) {
    Write-Host "Initializing Elastic Beanstalk..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow the prompts:" -ForegroundColor Cyan
    Write-Host "  Region: us-east-1" -ForegroundColor Cyan
    Write-Host "  Application name: wealth-backend" -ForegroundColor Cyan
    Write-Host "  Platform: Node.js 20" -ForegroundColor Cyan
    Write-Host "  SSH: No (or Yes if you want)" -ForegroundColor Cyan
    Write-Host ""
    
    eb init
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ EB initialization failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ EB already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Step 3: Test Build Locally" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Step 4: Deploy to AWS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$deploy = Read-Host "Ready to deploy? (y/n)"

if ($deploy -eq 'y') {
    Write-Host ""
    Write-Host "Deploying to AWS Elastic Beanstalk..." -ForegroundColor Yellow
    Write-Host "This may take 5-10 minutes..." -ForegroundColor Yellow
    Write-Host ""
    
    eb deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Deployment Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Getting environment URL..." -ForegroundColor Yellow
        eb status
        
        Write-Host ""
        Write-Host "Test your backend:" -ForegroundColor Cyan
        Write-Host "  eb open" -ForegroundColor Yellow
        Write-Host "  or visit: https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/health" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Check logs with:" -ForegroundColor Yellow
        Write-Host "  eb logs" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "  1. Environment variables not set" -ForegroundColor Yellow
        Write-Host "  2. MongoDB connection string incorrect" -ForegroundColor Yellow
        Write-Host "  3. AWS credentials invalid" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To deploy later, run:" -ForegroundColor Yellow
    Write-Host "  eb deploy" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Script Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  eb status          - Check environment status" -ForegroundColor Yellow
Write-Host "  eb logs            - View application logs" -ForegroundColor Yellow
Write-Host "  eb open            - Open app in browser" -ForegroundColor Yellow
Write-Host "  eb deploy          - Deploy new version" -ForegroundColor Yellow
Write-Host "  eb terminate       - Terminate environment" -ForegroundColor Yellow
Write-Host ""
