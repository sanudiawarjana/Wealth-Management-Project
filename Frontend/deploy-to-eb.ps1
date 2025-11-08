# Elastic Beanstalk Frontend Deployment Script
Write-Host "=== Preparing Frontend for Elastic Beanstalk Deployment ===" -ForegroundColor Cyan

# Step 1: Clean previous builds
Write-Host "`n[1/7] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }

# Step 2: Install dependencies
Write-Host "`n[2/7] Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Step 3: Build the application
Write-Host "`n[3/7] Building Next.js application..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Verify required files exist
Write-Host "`n[4/7] Verifying deployment files..." -ForegroundColor Yellow
$requiredFiles = @(
    "server.js",
    "Procfile",
    "package.json",
    ".ebextensions\nodecommand.config",
    ".ebextensions\nginx.config",
    ".platform\nginx\conf.d\elasticbeanstalk\00_application.conf"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Missing required file: $file" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Found: $file" -ForegroundColor Green
}

# Step 5: Create .ebignore file
Write-Host "`n[5/7] Creating .ebignore file..." -ForegroundColor Yellow
@"
node_modules/
.git/
.gitignore
*.md
documentation/
deploy-frontend/
test-*.ps1
verify-and-deploy.ps1
.env.local
.env.development
pnpm-lock.yaml
pnpm-workspace.yaml
*.log
.next/cache
"@ | Out-File -FilePath ".ebignore" -Encoding utf8

# Step 6: Initialize EB (if not already done)
Write-Host "`n[6/7] Checking Elastic Beanstalk initialization..." -ForegroundColor Yellow
if (-not (Test-Path ".elasticbeanstalk")) {
    Write-Host "⚠️  Elastic Beanstalk not initialized. Run:" -ForegroundColor Yellow
    Write-Host "   eb init" -ForegroundColor Cyan
    Write-Host "`nThen configure:" -ForegroundColor Yellow
    Write-Host "   - Application name: WealthManagementFrontend" -ForegroundColor Cyan
    Write-Host "   - Platform: Node.js 20" -ForegroundColor Cyan
    Write-Host "   - Region: Your preferred region" -ForegroundColor Cyan
} else {
    Write-Host "✅ Elastic Beanstalk initialized" -ForegroundColor Green
}

# Step 7: Deploy to Elastic Beanstalk
Write-Host "`n[7/7] Deploying to Elastic Beanstalk..." -ForegroundColor Yellow
Write-Host "`nRun the following command to deploy:" -ForegroundColor Cyan
Write-Host "   eb deploy WealthManagementFrontend-env" -ForegroundColor Green

Write-Host "`n=== Deployment Preparation Complete ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Verify .env.production has correct NEXT_PUBLIC_API_URL" -ForegroundColor White
Write-Host "2. Run: eb deploy WealthManagementFrontend-env" -ForegroundColor White
Write-Host "3. Monitor: eb logs --follow" -ForegroundColor White
Write-Host "4. Check health: eb health" -ForegroundColor White

# Display deployment checklist
Write-Host "`n[Checklist] Pre-deployment items:" -ForegroundColor Cyan
Write-Host "- Backend API is deployed and accessible" -ForegroundColor White
Write-Host "- .env.production contains correct NEXT_PUBLIC_API_URL" -ForegroundColor White
Write-Host "- Security groups allow HTTP/HTTPS traffic" -ForegroundColor White
Write-Host "- Application built successfully (no errors above)" -ForegroundColor White
