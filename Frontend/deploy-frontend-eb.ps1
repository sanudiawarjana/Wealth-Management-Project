# PowerShell script to deploy frontend to AWS Elastic Beanstalk
Write-Host "Starting frontend deployment to AWS Elastic Beanstalk..." -ForegroundColor Green

# Set AWS credentials
$env:AWS_ACCESS_KEY_ID = "AKIAR75T6EU66KQXNJLT"
$env:AWS_SECRET_ACCESS_KEY = "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"
$env:AWS_DEFAULT_REGION = "us-east-1"

Write-Host "Building Next.js application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green

# Check if EB CLI is installed
$ebInstalled = Get-Command eb -ErrorAction SilentlyContinue
if (-not $ebInstalled) {
    Write-Host "Installing EB CLI..." -ForegroundColor Yellow
    pip install awsebcli
}

# Initialize EB application if not already done
if (-not (Test-Path ".elasticbeanstalk")) {
    Write-Host "Initializing EB application..." -ForegroundColor Yellow
    eb init wealth-frontend --region us-east-1 --platform "Node.js 18"
}

# Deploy the application
Write-Host "Deploying application to Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy wealth-frontend-env

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your frontend is now deployed and connected to your backend!" -ForegroundColor Cyan
} else {
    Write-Host "Deployment failed." -ForegroundColor Red
    exit 1
}