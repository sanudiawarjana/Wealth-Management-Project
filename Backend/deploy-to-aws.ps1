# AWS Elastic Beanstalk Deployment Helper Script
# This script helps you deploy your application to AWS Elastic Beanstalk

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AWS Elastic Beanstalk Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if EB CLI is installed
Write-Host "Checking if EB CLI is installed..." -ForegroundColor Yellow
$ebInstalled = Get-Command eb -ErrorAction SilentlyContinue

if (-not $ebInstalled) {
    Write-Host "❌ EB CLI is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install EB CLI first:" -ForegroundColor Yellow
    Write-Host "  pip install awsebcli --upgrade --user" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ EB CLI is installed" -ForegroundColor Green
    $ebVersion = eb --version
    Write-Host "   Version: $ebVersion" -ForegroundColor Gray
}

Write-Host ""

# Check if already initialized
if (Test-Path ".elasticbeanstalk\config.yml") {
    Write-Host "✅ Elastic Beanstalk already initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "What would you like to do?" -ForegroundColor Yellow
    Write-Host "  1. Deploy to existing environment" -ForegroundColor White
    Write-Host "  2. Create new environment" -ForegroundColor White
    Write-Host "  3. View environment status" -ForegroundColor White
    Write-Host "  4. View logs" -ForegroundColor White
    Write-Host "  5. Set environment variables" -ForegroundColor White
    Write-Host "  6. Open application in browser" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter choice (1-6)"
    
    switch ($choice) {
        "1" {
            Write-Host ""
            Write-Host "Deploying to existing environment..." -ForegroundColor Yellow
            eb deploy
        }
        "2" {
            Write-Host ""
            $envName = Read-Host "Enter new environment name (e.g., financial-api-prod)"
            Write-Host "Creating environment: $envName" -ForegroundColor Yellow
            eb create $envName --instance-type t3.small --single
        }
        "3" {
            Write-Host ""
            Write-Host "Environment Status:" -ForegroundColor Yellow
            eb status
        }
        "4" {
            Write-Host ""
            Write-Host "Fetching logs..." -ForegroundColor Yellow
            eb logs
        }
        "5" {
            Write-Host ""
            Write-Host "Set Environment Variables" -ForegroundColor Yellow
            Write-Host "Example: eb setenv MONGO_URI='...' AWS_REGION='us-east-1'" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Current environment variables:" -ForegroundColor Yellow
            eb printenv
        }
        "6" {
            Write-Host ""
            Write-Host "Opening application in browser..." -ForegroundColor Yellow
            eb open
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  Elastic Beanstalk not initialized yet" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to deploy:" -ForegroundColor Cyan
    Write-Host "  1. Initialize: eb init" -ForegroundColor White
    Write-Host "  2. Create env: eb create financial-api-env --instance-type t3.small --single" -ForegroundColor White
    Write-Host "  3. Set env vars: eb setenv MONGO_URI='...' AWS_REGION='us-east-1'" -ForegroundColor White
    Write-Host "  4. Deploy: eb deploy" -ForegroundColor White
    Write-Host ""
    
    $doInit = Read-Host "Would you like to initialize now? (y/n)"
    
    if ($doInit -eq "y" -or $doInit -eq "Y") {
        Write-Host ""
        Write-Host "Initializing Elastic Beanstalk..." -ForegroundColor Yellow
        eb init
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Initialization complete!" -ForegroundColor Green
            Write-Host ""
            $doCreate = Read-Host "Create environment now? (y/n)"
            
            if ($doCreate -eq "y" -or $doCreate -eq "Y") {
                $envName = Read-Host "Enter environment name (default: financial-api-env)"
                if ([string]::IsNullOrWhiteSpace($envName)) {
                    $envName = "financial-api-env"
                }
                
                Write-Host ""
                Write-Host "Creating environment: $envName" -ForegroundColor Yellow
                Write-Host "This may take several minutes..." -ForegroundColor Gray
                eb create $envName --instance-type t3.small --single
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host ""
                    Write-Host "✅ Environment created successfully!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "⚠️  IMPORTANT: Set your environment variables!" -ForegroundColor Yellow
                    Write-Host "Run this command:" -ForegroundColor White
                    Write-Host "  eb setenv MONGO_URI='your-connection-string' AWS_REGION='us-east-1' NODE_ENV='production'" -ForegroundColor Cyan
                }
            }
        }
    } else {
        Write-Host ""
        Write-Host "Please refer to AWS_DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "For more information, see AWS_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan

