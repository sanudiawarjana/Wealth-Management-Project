# ===============================
# build-and-deploy.ps1
# Fully working AWS Elastic Beanstalk deployment script
# ===============================

# Configurations
$AppName = "wealth-frontend"
$EnvName = "wealth-frontend-env"
$Region = "us-east-1"
$S3Bucket = "my-wealth-frontend"
$MaxWaitMinutes = 15
$VersionLabel = "v$(Get-Date -Format yyyyMMddHHmmss)"

Write-Host "Starting frontend build and deployment..." -ForegroundColor Cyan

# Step 1: Check AWS CLI
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "AWS CLI authenticated successfully." -ForegroundColor Green
} catch {
    Write-Host "AWS CLI not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Step 2: Install dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    exit 1
}

# Step 3: Build Next.js
Write-Host "Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}
Write-Host "Build completed successfully!" -ForegroundColor Green

# Step 4: Create deploy package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
if (Test-Path deploy.zip) { Remove-Item deploy.zip -Force }
Compress-Archive -Path .next,node_modules,package.json,next.config.mjs,Procfile,.ebextensions -DestinationPath deploy.zip -Force
if (-not (Test-Path deploy.zip)) {
    Write-Host "Failed to create deploy.zip" -ForegroundColor Red
    exit 1
}
Write-Host "deploy.zip created" -ForegroundColor Green

# Step 5: Upload to S3
Write-Host "Uploading deploy.zip to S3..." -ForegroundColor Yellow
aws s3 cp deploy.zip s3://$S3Bucket/deploy.zip --region $Region
if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 upload failed" -ForegroundColor Red
    exit 1
}
Write-Host "Uploaded to S3" -ForegroundColor Green

# Step 6: Create application version
Write-Host "Creating application version..." -ForegroundColor Yellow
$AppExists = aws elasticbeanstalk describe-applications --application-names $AppName --query 'Applications[0].ApplicationName' --output text 2>$null
if ($AppExists -ne $AppName) {
    Write-Host "Creating application $AppName..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application --application-name $AppName --description "Wealth Frontend"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create application" -ForegroundColor Red
        exit 1
    }
}

aws elasticbeanstalk create-application-version `
    --application-name $AppName `
    --version-label $VersionLabel `
    --source-bundle S3Bucket=$S3Bucket,S3Key=deploy.zip `
    --region $Region

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create application version" -ForegroundColor Red
    exit 1
}

# Step 7: Create or update environment
Write-Host "Checking environment..." -ForegroundColor Yellow
$EnvExists = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].EnvironmentName' --output text 2>$null

if ($EnvExists -eq $EnvName) {
    Write-Host "Updating environment $EnvName..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --environment-name $EnvName `
        --version-label $VersionLabel `
        --region $Region
} else {
    Write-Host "Creating environment $EnvName..." -ForegroundColor Yellow
    aws elasticbeanstalk create-environment `
        --application-name $AppName `
        --environment-name $EnvName `
        --version-label $VersionLabel `
        --solution-stack-name "Node.js 18 running on 64bit Amazon Linux 2" `
        --region $Region
}

# Step 8: Wait for environment to become healthy
Write-Host "Waiting for environment to be healthy..." -ForegroundColor Yellow
$EndTime = (Get-Date).AddMinutes($MaxWaitMinutes)
do {
    $Status = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].Status' --output text
    $Health = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].Health' --output text

    if ($Status -eq "Ready" -and $Health -eq "Green") {
        Write-Host "Environment is healthy!" -ForegroundColor Green
        break
    }

    Write-Host "Status: $Status, Health: $Health - Waiting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    if (Get-Date -gt $EndTime) {
        Write-Host "Timeout reached. Environment may still be deploying." -ForegroundColor Yellow
        break
    }
} while ($true)

# Step 9: Deployment finished
Write-Host "Deployment finished!" -ForegroundColor Green
Write-Host "Visit: https://$EnvName.$Region.elasticbeanstalk.com"
