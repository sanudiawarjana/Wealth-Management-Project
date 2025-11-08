# 🚀 Production Deployment Guide

Complete guide to convert your local app to a production application.

---

## 📋 **Overview**

**Current State:**
- ✅ Backend: Running locally on port 5000
- ✅ Frontend: Running locally on port 3000
- ✅ MongoDB: Atlas (cloud)
- ✅ All features working

**Production Goal:**
- 🎯 Backend: AWS Elastic Beanstalk (already set up!)
- 🎯 Frontend: Vercel/Netlify (recommended)
- 🎯 Database: MongoDB Atlas (production cluster)
- 🎯 Custom domain (optional)

---

## ✅ **Step 1: Deploy Backend to AWS Elastic Beanstalk**

### **1.1 Prepare Backend for Production**

```powershell
cd Backend

# Check if EB is initialized
ls .elasticbeanstalk

# If not initialized, run:
eb init
```

**EB Init Configuration:**
```
Region: us-east-1
Application name: wealth-management-backend
Platform: Node.js
Platform version: Node.js 20 running on 64bit Amazon Linux 2023
SSH: Yes (recommended)
```

### **1.2 Create Production Environment**

```powershell
# Create production environment
eb create production-env

# Or if environment exists:
eb use production-env
```

### **1.3 Set Environment Variables**

```powershell
# Set all production environment variables
eb setenv `
  NODE_ENV=production `
  PORT=8080 `
  MONGO_URI="mongodb+srv://kchamod1124:Kavindu1124@wealthplanner.mvpovg3.mongodb.net/wealthdb?retryWrites=true&w=majority" `
  AWS_REGION=us-east-1 `
  AWS_ACCESS_KEY_ID=AKIAR75T6EU63O4LV32W `
  AWS_SECRET_ACCESS_KEY=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 `
  BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0 `
  ANTHROPIC_VERSION=bedrock-2023-05-31 `
  FRONTEND_URL=*
```

**Important:** `FRONTEND_URL=*` allows all origins initially. Update with your frontend URL after deployment.

### **1.4 Deploy Backend**

```powershell
# Deploy to AWS
eb deploy

# Wait 3-5 minutes for deployment
```

### **1.5 Get Backend URL**

```powershell
# Get your backend URL
eb status

# Example output:
# CNAME: production-env.us-east-1.elasticbeanstalk.com
# Status: Ready
# Health: Green
```

**Your backend URL will be:**
```
http://production-env.us-east-1.elasticbeanstalk.com
```

### **1.6 Test Backend**

```powershell
# Test health endpoint
$backendUrl = "http://production-env.us-east-1.elasticbeanstalk.com"
Invoke-RestMethod -Uri "$backendUrl/health"

# Test API
Invoke-RestMethod -Uri "$backendUrl/api/income"
```

---

## ✅ **Step 2: Configure Frontend for Production**

### **2.1 Update Environment Variables**

**File:** `Frontend/.env.production`

Create this file:
```env
NEXT_PUBLIC_API_URL=http://production-env.us-east-1.elasticbeanstalk.com/api
```

**Replace** `production-env.us-east-1.elasticbeanstalk.com` with your actual backend URL from Step 1.5

### **2.2 Test Frontend Locally with Production Backend**

```powershell
cd Frontend

# Build for production
npm run build

# Test production build locally
npm start
```

Open http://localhost:3000 and verify it connects to the production backend.

---

## ✅ **Step 3: Deploy Frontend**

### **Option A: Deploy to Vercel (Recommended - Easiest)**

#### **3.1 Install Vercel CLI**

```powershell
npm install -g vercel
```

#### **3.2 Deploy**

```powershell
cd Frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Project name: wealth-management-frontend
# Deploy: Yes
```

#### **3.3 Set Environment Variable**

```powershell
# Set production environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter value: http://your-backend-url.elasticbeanstalk.com/api
```

#### **3.4 Deploy to Production**

```powershell
# Deploy to production
vercel --prod
```

**Your frontend URL:**
```
https://wealth-management-frontend.vercel.app
```

---

### **Option B: Deploy to Netlify**

#### **3.1 Build Frontend**

```powershell
cd Frontend

# Build
npm run build
```

#### **3.2 Install Netlify CLI**

```powershell
npm install -g netlify-cli
```

#### **3.3 Deploy**

```powershell
# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod --dir=.next
```

#### **3.4 Set Environment Variable**

1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Add `NEXT_PUBLIC_API_URL` = `http://your-backend-url.elasticbeanstalk.com/api`
4. Redeploy

---

### **Option C: Deploy to AWS Amplify**

#### **3.1 Build Settings**

Create `amplify.yml` in Frontend folder:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### **3.2 Deploy**

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Select Frontend folder
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

---

## ✅ **Step 4: Update CORS**

After deploying frontend, update backend CORS:

### **4.1 Update Backend .env**

```powershell
cd Backend

# Update CORS to allow your frontend domain
eb setenv FRONTEND_URL=https://wealth-management-frontend.vercel.app

# Redeploy
eb deploy
```

### **4.2 Verify CORS**

```powershell
# Test from your deployed frontend
# Open browser console and run:
fetch('http://your-backend-url.elasticbeanstalk.com/health')
  .then(r => r.json())
  .then(data => console.log('CORS working:', data))
```

---

## ✅ **Step 5: Testing Production App**

### **5.1 Test Backend**

```powershell
# Health check
curl http://your-backend-url.elasticbeanstalk.com/health

# API endpoints
curl http://your-backend-url.elasticbeanstalk.com/api/income
```

### **5.2 Test Frontend**

1. Open https://your-frontend-url.vercel.app
2. Try adding income
3. Try adding assets
4. Generate AI recommendations
5. Check all features work

### **5.3 Test End-to-End**

```powershell
# Create test data via frontend
# Verify in MongoDB Atlas
# Check logs in AWS CloudWatch
```

---

## ✅ **Step 6: Custom Domain (Optional)**

### **6.1 Backend Custom Domain**

**Option A: Route 53**
```powershell
# 1. Buy domain in Route 53
# 2. Create CNAME record
api.your-domain.com → your-app.elasticbeanstalk.com
```

**Option B: Other DNS Provider**
```
# Add CNAME record:
Host: api
Points to: your-app.us-east-1.elasticbeanstalk.com
TTL: 3600
```

### **6.2 Frontend Custom Domain**

**Vercel:**
1. Go to Project Settings → Domains
2. Add domain: `your-domain.com`
3. Follow DNS configuration

**Netlify:**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS

### **6.3 Update Environment Variables**

```powershell
# Frontend
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api

# Backend
FRONTEND_URL=https://your-domain.com
```

---

## ✅ **Step 7: Security & Optimization**

### **7.1 Enable HTTPS**

**Backend:**
```powershell
# Use AWS Certificate Manager
# 1. Request SSL certificate
# 2. Add to Load Balancer
# 3. Update frontend to use https://
```

**Frontend:**
- Vercel/Netlify automatically provide HTTPS ✅

### **7.2 Environment Secrets**

**Never commit:**
- `.env`
- `.env.production`
- `.env.local`

**Use:**
- AWS Secrets Manager (backend)
- Vercel/Netlify environment variables (frontend)

### **7.3 Database Security**

```
MongoDB Atlas:
- [ ] Enable Network Access restriction
- [ ] Rotate passwords monthly
- [ ] Enable backup (daily)
- [ ] Enable monitoring
- [ ] Set up alerts
```

---

## 📊 **Production URLs Summary**

After deployment, you'll have:

```
Backend:  http://production-env.us-east-1.elasticbeanstalk.com
Frontend: https://wealth-management-frontend.vercel.app
Database: MongoDB Atlas (cloud)

Or with custom domains:
Backend:  https://api.your-domain.com
Frontend: https://your-domain.com
```

---

## 🔧 **Maintenance Commands**

### **Backend (AWS EB)**

```powershell
# View logs
eb logs

# SSH into server
eb ssh

# Check status
eb status

# Open in browser
eb open

# Scale
eb scale 2

# Update environment variables
eb setenv KEY=VALUE

# Redeploy
eb deploy
```

### **Frontend (Vercel)**

```powershell
# View logs
vercel logs

# List deployments
vercel ls

# Promote deployment
vercel promote

# Rollback
vercel rollback
```

---

## 🚨 **Troubleshooting**

### **Backend Issues**

**Problem:** Health check fails
```powershell
# Check logs
eb logs

# Common fixes:
# 1. Check PORT is 8080 (EB default)
# 2. Verify MongoDB connection
# 3. Check environment variables
```

**Problem:** MongoDB connection fails
```powershell
# Verify connection string
eb printenv | findstr MONGO

# Check MongoDB Atlas:
# - Network access allows 0.0.0.0/0
# - User has correct permissions
# - Cluster is running
```

### **Frontend Issues**

**Problem:** Can't connect to backend
```powershell
# Check environment variable
vercel env ls

# Verify CORS on backend
curl -H "Origin: https://your-frontend.vercel.app" `
  http://your-backend.elasticbeanstalk.com/health
```

**Problem:** Build fails
```powershell
# Check build logs
# Common fixes:
# 1. Run npm install locally
# 2. Fix TypeScript errors
# 3. Check environment variables
```

---

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database backed up
- [ ] Secrets secured

### **Backend Deployment**
- [ ] EB initialized
- [ ] Environment created
- [ ] Environment variables set
- [ ] Code deployed
- [ ] Health check passing
- [ ] API endpoints tested

### **Frontend Deployment**
- [ ] Production build tested locally
- [ ] Environment variable configured
- [ ] Deployed to Vercel/Netlify
- [ ] Domain configured (optional)
- [ ] HTTPS enabled
- [ ] Can connect to backend

### **Post-Deployment**
- [ ] End-to-end testing complete
- [ ] CORS configured correctly
- [ ] Monitoring enabled
- [ ] Logs accessible
- [ ] Backup strategy in place

---

## 📝 **Quick Start Commands**

```powershell
# Backend Deployment
cd Backend
eb create production-env
eb setenv NODE_ENV=production MONGO_URI="..." [other vars]
eb deploy
eb open

# Frontend Deployment (Vercel)
cd Frontend
vercel
vercel env add NEXT_PUBLIC_API_URL production
vercel --prod

# Update Backend URL in Frontend
vercel env add NEXT_PUBLIC_API_URL production
# Enter: http://your-backend.elasticbeanstalk.com/api

# Update Frontend URL in Backend
eb setenv FRONTEND_URL=https://your-frontend.vercel.app
eb deploy
```

---

## 🎉 **Success!**

Your wealth management application is now live in production!

**What you have:**
- ✅ Scalable backend on AWS
- ✅ Fast frontend on Vercel/Netlify
- ✅ Secure MongoDB Atlas database
- ✅ AI-powered recommendations
- ✅ Production-ready architecture

**Next steps:**
1. Share the app with users
2. Monitor performance
3. Set up analytics
4. Plan new features

---

**Need help?** Check:
- `Backend/AWS_DEPLOYMENT_GUIDE.md`
- `Backend/documentation/DEPLOYMENT.md`
- `Backend/TROUBLESHOOTING.md`
