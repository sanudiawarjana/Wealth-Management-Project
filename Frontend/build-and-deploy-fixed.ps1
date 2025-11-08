# ==============================================
# 🚀 Automatic Frontend Build & AWS Deployment Script
# ==============================================
Write-Host "🚀 Starting frontend build and deployment to AWS Elastic Beanstalk..." -ForegroundColor Green

# --- Configuration ---
$AppName = "wealth-frontend"
$EnvName = "wealth-frontend-env"
$Region = "us-east-1"
$VersionLabel = "v$(Get-Date -Format 'yyyyMMddHHmmss')"
$ZipPath = "deploy.zip"
$MaxWaitMinutes = 15   # max wait for environment to become healthy

# --- Step 1: Check AWS credentials ---
Write-Host "🔐 Checking AWS CLI configuration..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI authenticated successfully." -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# --- Step 1.5: Get AWS account ID ---
$AccountId = aws sts get-caller-identity --query Account --output text
if ([string]::IsNullOrEmpty($AccountId)) {
    Write-Host "❌ Failed to get AWS Account ID. Exiting." -ForegroundColor Red
    exit 1
}
$S3Bucket = "elasticbeanstalk-$Region-$AccountId"
$S3Key = "$AppName/$VersionLabel.zip"

# --- Step 2: Install dependencies ---
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed. Exiting." -ForegroundColor Red
    exit 1
}

# --- Step 3: Build Next.js app ---
Write-Host "🏗️ Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# --- Step 4: Create deployment package ---
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path $ZipPath) {
    try {
        Remove-Item -Path $ZipPath -Force
        Write-Host "🧹 Old deploy.zip removed." -ForegroundColor DarkGray
    } catch {
        Write-Host "⚠️ Could not remove old deploy.zip. It might be open in another program." -ForegroundColor Yellow
    }
}
Compress-Archive -Path ".next","node_modules","package.json","next.config.mjs","Procfile",".ebextensions" -DestinationPath $ZipPath -Force
if (-Not (Test-Path $ZipPath)) {
    Write-Host "❌ Failed to create deploy.zip. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment package created: $ZipPath" -ForegroundColor Green

# --- Step 5: Upload to S3 ---
Write-Host "☁️ Uploading package to S3..." -ForegroundColor Yellow
aws s3 cp $ZipPath "s3://$S3Bucket/$S3Key" --region $Region
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ S3 upload failed. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Uploaded to s3://$S3Bucket/$S3Key" -ForegroundColor Green

# --- Step 6: Create new application version ---
Write-Host "🧩 Creating new Elastic Beanstalk application version..." -ForegroundColor Yellow
$AppExists = aws elasticbeanstalk describe-applications --application-names $AppName --query 'Applications[0].ApplicationName' --output text 2>$null
if ($AppExists -eq $AppName) {
    Write-Host "✅ Application $AppName already exists." -ForegroundColor Green
} else {
    Write-Host "🆕 Creating new Elastic Beanstalk application..." -ForegroundColor Yellow
    aws elasticbeanstalk create-application --application-name $AppName --description "Wealth Frontend Application"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create application. Exiting." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Application $AppName created." -ForegroundColor Green
}

aws elasticbeanstalk create-application-version `
    --application-name $AppName `
    --version-label $VersionLabel `
    --source-bundle S3Bucket=$S3Bucket,S3Key=$S3Key `
    --region $Region
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create application version. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Application version $VersionLabel created." -ForegroundColor Green

# --- Step 7: Check if environment exists, create or update ---
Write-Host "🌍 Checking Elastic Beanstalk environment..." -ForegroundColor Yellow
$EnvExists = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].EnvironmentName' --output text 2>$null

if ($EnvExists -eq $EnvName) {
    Write-Host "🔄 Updating existing environment..." -ForegroundColor Yellow
    aws elasticbeanstalk update-environment `
        --environment-name $EnvName `
        --version-label $VersionLabel `
        --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Environment update failed. Check your Elastic Beanstalk console." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "🆕 Creating new Elastic Beanstalk environment..." -ForegroundColor Yellow
    aws elasticbeanstalk create-environment `
        --application-name $AppName `
        --environment-name $EnvName `
        --version-label $VersionLabel `
        --solution-stack-name "Node.js 18 running on 64bit Amazon Linux 2" `
        --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Environment creation failed. Check your Elastic Beanstalk console." -ForegroundColor Red
        exit 1
    }
}

# --- Step 7.5: Wait for environment to become healthy ---
Write-Host "⏳ Waiting for environment to become healthy. Will wait up to $MaxWaitMinutes minutes." -ForegroundColor Yellow
$StartTime = Get-Date
$Timeout = $StartTime.AddMinutes($MaxWaitMinutes)

do {
    $EnvStatus = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].Status' --output text 2>$null
    $EnvHealth = aws elasticbeanstalk describe-environments --application-name $AppName --environment-names $EnvName --query 'Environments[0].Health' --output text 2>$null
    
    if ($EnvStatus -eq "Ready" -and $EnvHealth -eq "Green") {
        Write-Host "✅ Environment is healthy and ready!" -ForegroundColor Green
        break
    }
    
    Write-Host "⏳ Environment status: $EnvStatus, Health: $EnvHealth (Waiting...)" -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    $CurrentTime = Get-Date
    if ($CurrentTime -gt $Timeout) {
        Write-Host "⚠️ Timeout reached. Environment may still be deploying." -ForegroundColor Yellow
        break
    }
} while ($true)

# --- Step 8: Deployment success ---
Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "🔗 Visit your app at: https://$EnvName.$Region.elasticbeanstalk.com" -ForegroundColor Cyan
Write-Host "⏳ Environment may take a few minutes to finish deploying..." -ForegroundColor Yellow