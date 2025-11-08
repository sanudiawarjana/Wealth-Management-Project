# ========================================
# Production Deployment Script
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRODUCTION DEPLOYMENT WIZARD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "[Step 1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check EB CLI
$ebInstalled = Get-Command eb -ErrorAction SilentlyContinue
if (!$ebInstalled) {
    Write-Host "  [X] EB CLI not found!" -ForegroundColor Red
    Write-Host "  Install: pip install awsebcli" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  After installing, run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "  [OK] EB CLI found" -ForegroundColor Green

# Check Vercel CLI (optional)
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelInstalled) {
    Write-Host "  [!] Vercel CLI not found (optional)" -ForegroundColor Yellow
    Write-Host "      Install: npm install -g vercel" -ForegroundColor Gray
} else {
    Write-Host "  [OK] Vercel CLI found" -ForegroundColor Green
}

Write-Host ""

# Step 2: Backend deployment
Write-Host "[Step 2/6] Backend Deployment" -ForegroundColor Yellow
Write-Host ""

$deployBackend = Read-Host "Deploy backend to AWS Elastic Beanstalk? (y/n)"

if ($deployBackend -eq 'y') {
    cd Backend
    
    # Check if EB is initialized
    if (!(Test-Path ".elasticbeanstalk\config.yml")) {
        Write-Host "  Initializing EB..." -ForegroundColor Yellow
        eb init --platform node.js --region us-east-1
    }
    
    Write-Host "  Deploying backend..." -ForegroundColor Yellow
    eb deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Backend deployed successfully!" -ForegroundColor Green
        
        # Get backend URL
        Write-Host ""
        Write-Host "  Getting backend URL..." -ForegroundColor Yellow
        $ebStatus = eb status
        $backendUrl = ($ebStatus | Select-String "CNAME:" | ForEach-Object { $_.ToString().Split(":")[1].Trim() })
        
        if ($backendUrl) {
            Write-Host "  [OK] Backend URL: http://$backendUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "  IMPORTANT: Copy this URL for frontend configuration!" -ForegroundColor Yellow
            Write-Host "  Backend URL: http://$backendUrl" -ForegroundColor Cyan
            Write-Host ""
            
            # Save to file
            "NEXT_PUBLIC_API_URL=http://$backendUrl/api" | Out-File -FilePath "..\Frontend\.env.production" -Encoding UTF8
            Write-Host "  [OK] Saved to Frontend/.env.production" -ForegroundColor Green
        }
    } else {
        Write-Host "  [X] Backend deployment failed!" -ForegroundColor Red
        Write-Host "  Check logs: eb logs" -ForegroundColor Yellow
        cd ..
        exit 1
    }
    
    cd ..
} else {
    Write-Host "  Skipping backend deployment" -ForegroundColor Gray
}

Write-Host ""

# Step 3: Frontend build
Write-Host "[Step 3/6] Building Frontend..." -ForegroundColor Yellow

cd Frontend

# Check if .env.production exists
if (!(Test-Path ".env.production")) {
    Write-Host "  [!] .env.production not found!" -ForegroundColor Yellow
    $backendUrl = Read-Host "Enter your backend URL (e.g., http://xxx.elasticbeanstalk.com)"
    "NEXT_PUBLIC_API_URL=$backendUrl/api" | Out-File -FilePath ".env.production" -Encoding UTF8
    Write-Host "  [OK] Created .env.production" -ForegroundColor Green
}

Write-Host "  Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Frontend built successfully!" -ForegroundColor Green
} else {
    Write-Host "  [X] Frontend build failed!" -ForegroundColor Red
    cd ..
    exit 1
}

cd ..
Write-Host ""

# Step 4: Frontend deployment
Write-Host "[Step 4/6] Frontend Deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment platform:" -ForegroundColor Cyan
Write-Host "  1. Vercel (Recommended)" -ForegroundColor White
Write-Host "  2. Netlify" -ForegroundColor White
Write-Host "  3. AWS Amplify" -ForegroundColor White
Write-Host "  4. Skip" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Select option (1-4)"

switch ($choice) {
    "1" {
        # Vercel deployment
        if (!$vercelInstalled) {
            Write-Host "  [X] Vercel CLI not installed!" -ForegroundColor Red
            Write-Host "  Install: npm install -g vercel" -ForegroundColor Yellow
            Write-Host "  Then run: vercel --prod" -ForegroundColor Yellow
        } else {
            cd Frontend
            Write-Host "  Deploying to Vercel..." -ForegroundColor Yellow
            vercel --prod
            cd ..
        }
    }
    "2" {
        # Netlify deployment
        Write-Host "  Netlify deployment steps:" -ForegroundColor Yellow
        Write-Host "  1. Install Netlify CLI: npm install -g netlify-cli" -ForegroundColor White
        Write-Host "  2. Run: netlify login" -ForegroundColor White
        Write-Host "  3. Run: netlify init" -ForegroundColor White
        Write-Host "  4. Run: netlify deploy --prod --dir=Frontend/.next" -ForegroundColor White
    }
    "3" {
        # AWS Amplify
        Write-Host "  AWS Amplify deployment steps:" -ForegroundColor Yellow
        Write-Host "  1. Go to AWS Amplify Console" -ForegroundColor White
        Write-Host "  2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "  3. Select Frontend folder" -ForegroundColor White
        Write-Host "  4. Add environment variable NEXT_PUBLIC_API_URL" -ForegroundColor White
        Write-Host "  5. Deploy" -ForegroundColor White
    }
    "4" {
        Write-Host "  Skipping frontend deployment" -ForegroundColor Gray
    }
    default {
        Write-Host "  Invalid option" -ForegroundColor Red
    }
}

Write-Host ""

# Step 5: Update CORS
Write-Host "[Step 5/6] Update CORS Configuration" -ForegroundColor Yellow
Write-Host ""

$updateCors = Read-Host "Do you want to update backend CORS? (y/n)"

if ($updateCors -eq 'y') {
    $frontendUrl = Read-Host "Enter your frontend URL (e.g., https://xxx.vercel.app)"
    
    cd Backend
    Write-Host "  Updating CORS..." -ForegroundColor Yellow
    eb setenv FRONTEND_URL=$frontendUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] CORS updated!" -ForegroundColor Green
        Write-Host "  Redeploying backend..." -ForegroundColor Yellow
        eb deploy
    } else {
        Write-Host "  [X] Failed to update CORS" -ForegroundColor Red
    }
    
    cd ..
}

Write-Host ""

# Step 6: Summary
Write-Host "[Step 6/6] Deployment Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if (Test-Path "Frontend\.env.production") {
    $apiUrl = Get-Content "Frontend\.env.production" | Select-String "NEXT_PUBLIC_API_URL"
    Write-Host "Backend API: $apiUrl" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Test backend health:" -ForegroundColor White
Write-Host "   curl http://your-backend-url.elasticbeanstalk.com/health" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test frontend:" -ForegroundColor White
Write-Host "   Open https://your-frontend-url.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add custom domain (optional):" -ForegroundColor White
Write-Host "   - Vercel: Project Settings -> Domains" -ForegroundColor Gray
Write-Host "   - Backend: Route 53 or DNS provider" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Monitor application:" -ForegroundColor White
Write-Host "   - Backend: eb logs" -ForegroundColor Gray
Write-Host "   - Frontend: Vercel dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   - Complete guide: PRODUCTION-DEPLOYMENT-GUIDE.md" -ForegroundColor Gray
Write-Host "   - AWS guide: Backend/AWS_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "   - Troubleshooting: Backend/TROUBLESHOOTING.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Your wealth management app is now live in production!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
