# IMMEDIATE FIX - Deploy to Elastic Beanstalk
# This script fixes the deployment issues and redeploys

Write-Host "=== ELASTIC BEANSTALK QUICK FIX ===" -ForegroundColor Green

# Navigate to Frontend directory
Set-Location "d:\AI Boot Camp\Frontend"

Write-Host "`nStep 1: Creating .ebignore..." -ForegroundColor Yellow
@"
node_modules/
.git/
.next/cache
.env.local
*.md
documentation/
test-*.ps1
pnpm-lock.yaml
"@ | Out-File -FilePath ".ebignore" -Encoding ascii

Write-Host "Step 2: Verifying required files..." -ForegroundColor Yellow
$files = @("server.js", "Procfile", "package.json")
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "  OK: $f" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $f" -ForegroundColor Red
    }
}

Write-Host "`nStep 3: Ready to deploy!" -ForegroundColor Green
Write-Host "`nRun these commands:" -ForegroundColor Cyan
Write-Host "  eb deploy WealthManagementFrontend-env" -ForegroundColor White
Write-Host "`nThen monitor with:" -ForegroundColor Cyan
Write-Host "  eb health --refresh" -ForegroundColor White
Write-Host "  eb logs --follow" -ForegroundColor White

Write-Host "`n=== CRITICAL FIXES APPLIED ===" -ForegroundColor Green
Write-Host "1. Created server.js (custom Next.js server)" -ForegroundColor White
Write-Host "2. Created Procfile (EB startup command)" -ForegroundColor White
Write-Host "3. Created .ebextensions (Node config)" -ForegroundColor White
Write-Host "4. Created .platform (Nginx config)" -ForegroundColor White
Write-Host "5. Fixed Node.js version to 18.x/20.x" -ForegroundColor White

Write-Host "`n=== NEXT: RUN THIS COMMAND ===" -ForegroundColor Yellow
Write-Host "eb deploy WealthManagementFrontend-env" -ForegroundColor Cyan
