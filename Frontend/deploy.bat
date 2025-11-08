@echo off
echo 🚀 Starting deployment to AWS Elastic Beanstalk...

REM Configuration
set AppName=wealth-frontend
set EnvName=wealth-frontend-env
set Region=us-east-1
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set VersionLabel=v%dt:~0,8%%dt:~8,6%

echo 🔐 Checking AWS CLI configuration...
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI not configured. Please run 'aws configure' first.
    exit /b 1
)

echo ✅ AWS CLI authenticated successfully.

echo 🏗️ Building Next.js application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Exiting.
    exit /b 1
)
echo ✅ Build completed successfully!

echo 📦 Creating deployment package...
if exist deploy.zip del deploy.zip
powershell -Command "Compress-Archive -Path '.next','node_modules','package.json','next.config.mjs','Procfile','.ebextensions' -DestinationPath 'deploy.zip' -Force"
if not exist deploy.zip (
    echo ❌ Failed to create deploy.zip. Exiting.
    exit /b 1
)
echo ✅ Deployment package created: deploy.zip

echo ☁️ Uploading package to S3...
for /f %%i in ('aws sts get-caller-identity --query Account --output text') do set AccountId=%%i
set S3Bucket=elasticbeanstalk-%Region%-%AccountId%
set S3Key=%AppName%/%VersionLabel%.zip

aws s3 cp deploy.zip s3://%S3Bucket%/%S3Key% --region %Region%
if %errorlevel% neq 0 (
    echo ❌ S3 upload failed. Exiting.
    exit /b 1
)
echo ✅ Uploaded to s3://%S3Bucket%/%S3Key%

echo 🧩 Creating new Elastic Beanstalk application version...
aws elasticbeanstalk create-application-version --application-name %AppName% --version-label %VersionLabel% --source-bundle S3Bucket=%S3Bucket%,S3Key=%S3Key% --region %Region%
if %errorlevel% neq 0 (
    echo ❌ Failed to create application version. Exiting.
    exit /b 1
)
echo ✅ Application version %VersionLabel% created.

echo 🌍 Deploying to Elastic Beanstalk environment...
aws elasticbeanstalk update-environment --environment-name %EnvName% --version-label %VersionLabel% --region %Region%
if %errorlevel% neq 0 (
    echo ❌ Environment update failed. Check your Elastic Beanstalk console.
    exit /b 1
)

echo 🎉 Deployment initiated successfully!
echo 🔗 Visit your app at: https://%EnvName%.%Region%.elasticbeanstalk.com
echo ⏳ Environment may take a few minutes to finish deploying...