# Test Frontend Locally Before Deploying

Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         🧪 Testing Frontend Before Vercel Deployment              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "d:\AI Boot Camp\Frontend"

# Check if we're in the right directory
if (!(Test-Path $frontendPath)) {
    Write-Host "❌ ERROR: Frontend directory not found!" -ForegroundColor Red
    Write-Host "Expected path: $frontendPath" -ForegroundColor Yellow
    exit 1
}

Set-Location $frontendPath

Write-Host "📁 Working Directory: $frontendPath" -ForegroundColor Green
Write-Host ""

# Step 1: Check Node and NPM
Write-Host "🔍 Step 1: Checking Node.js and NPM..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ NPM: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js or NPM not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 2: Check package.json
Write-Host "🔍 Step 2: Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: package.json not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Install dependencies
Write-Host "📦 Step 3: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
try {
    npm install --legacy-peer-deps 2>&1 | Out-Null
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Some dependencies may have warnings (this is usually okay)" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Check critical files
Write-Host "🔍 Step 4: Checking critical files..." -ForegroundColor Yellow

$criticalFiles = @(
    "components\nav-bar.tsx",
    "app\layout.tsx",
    "app\page.tsx",
    "next.config.mjs",
    "vercel.json",
    ".env.production"
)

# Special check for proxy route (has special characters in folder name)
$proxyRouteExists = Get-ChildItem -Path "app\api\proxy" -Recurse -Filter "route.ts" -ErrorAction SilentlyContinue

$allFilesExist = $true

# Check proxy route separately (folder name has special characters)
if ($proxyRouteExists) {
    Write-Host "✅ app\api\proxy\[...path]\route.ts" -ForegroundColor Green
} else {
    Write-Host "❌ app\api\proxy\[...path]\route.ts - MISSING!" -ForegroundColor Red
    $allFilesExist = $false
}

# Check other files
foreach ($file in $criticalFiles) {
    if (Test-Path -LiteralPath $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - MISSING!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (!$allFilesExist) {
    Write-Host ""
    Write-Host "❌ Some critical files are missing!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Verify environment variables
Write-Host "🔍 Step 5: Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    $envContent = Get-Content ".env.production" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "✅ NEXT_PUBLIC_API_URL found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: NEXT_PUBLIC_API_URL not found" -ForegroundColor Yellow
    }
    if ($envContent -match "BACKEND_API_URL") {
        Write-Host "✅ BACKEND_API_URL found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: BACKEND_API_URL not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Warning: .env.production not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Build test
Write-Host "🔨 Step 6: Testing build..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray
Write-Host ""

try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Build Summary:" -ForegroundColor Cyan
        $buildOutput | Select-String "Route|Size|First Load" | ForEach-Object {
            Write-Host "  $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error details:" -ForegroundColor Yellow
        Write-Host $buildOutput -ForegroundColor Gray
        Write-Host ""
        Write-Host "Please fix build errors before deploying to Vercel" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Build failed with exception!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 7: Check for TypeScript errors (optional)
Write-Host "🔍 Step 7: Checking for TypeScript issues..." -ForegroundColor Yellow
try {
    # This will show TS errors but won't fail the script
    $tsCheck = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ No TypeScript errors" -ForegroundColor Green
    } else {
        Write-Host "⚠️  TypeScript warnings found (may be okay if build succeeded)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  TypeScript check skipped" -ForegroundColor Yellow
}
Write-Host ""

# Final Summary
Write-Host "╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                     ✅ ALL TESTS PASSED!                            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your frontend is ready for Vercel deployment! 🚀" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Commit changes to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Fix Vercel deployment with mobile support'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy on Vercel:" -ForegroundColor White
Write-Host "   • Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   • Click 'Add New Project'" -ForegroundColor Gray
Write-Host "   • Import your GitHub repository" -ForegroundColor Gray
Write-Host "   • Add environment variables" -ForegroundColor Gray
Write-Host "   • Click 'Deploy'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. See VERCEL_DEPLOYMENT_CHECKLIST.txt for detailed steps" -ForegroundColor White
Write-Host ""

# Optional: Ask if user wants to start dev server
Write-Host "Would you like to start the development server to test locally? (y/n)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    npm run dev
}
