# 🚀 QUICK START - Convert to Production App

This is a quick reference guide. For complete instructions, see `PRODUCTION-DEPLOYMENT-GUIDE.md`

---

## ✅ **Prerequisites**

Install required tools:

```powershell
# 1. Install EB CLI (for AWS deployment)
pip install awsebcli

# 2. Install Vercel CLI (for frontend deployment)
npm install -g vercel
```

---

## 🚀 **Option 1: Automated Deployment (Recommended)**

Run the deployment wizard:

```powershell
cd "d:\AI Boot Camp"
.\deploy-production.ps1
```

The wizard will:
- ✅ Deploy backend to AWS Elastic Beanstalk
- ✅ Build frontend for production
- ✅ Deploy frontend to Vercel
- ✅ Configure CORS
- ✅ Provide deployment URLs

---

## 🚀 **Option 2: Manual Deployment**

### **Step 1: Deploy Backend**

```powershell
cd Backend

# Initialize EB (first time only)
eb init

# Create environment (first time only)
eb create production-env

# Deploy
eb deploy

# Get backend URL
eb status
```

**Copy the CNAME URL** - you'll need it for frontend configuration.

Example: `production-env.us-east-1.elasticbeanstalk.com`

---

### **Step 2: Configure Frontend**

Create `Frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=http://production-env.us-east-1.elasticbeanstalk.com/api
```

**Replace** `production-env.us-east-1.elasticbeanstalk.com` with your actual backend URL.

---

### **Step 3: Deploy Frontend**

```powershell
cd Frontend

# Build for production
npm run build

# Deploy to Vercel
vercel login
vercel --prod
```

**Copy the deployment URL** - this is your live application!

Example: `https://wealth-management-frontend.vercel.app`

---

### **Step 4: Update CORS**

```powershell
cd Backend

# Update CORS to allow your frontend domain
eb setenv FRONTEND_URL=https://wealth-management-frontend.vercel.app

# Redeploy
eb deploy
```

---

## ✅ **Test Your Production App**

### **Test Backend**

```powershell
# Health check
curl http://production-env.us-east-1.elasticbeanstalk.com/health

# Test API
curl http://production-env.us-east-1.elasticbeanstalk.com/api/income
```

### **Test Frontend**

1. Open your frontend URL in browser
2. Try adding income
3. Try adding assets
4. Click "Generate New Insights"
5. Verify all features work

---

## 📊 **Your Production URLs**

After deployment:

```
✅ Backend:  http://production-env.us-east-1.elasticbeanstalk.com
✅ Frontend: https://wealth-management-frontend.vercel.app
✅ Database: MongoDB Atlas (already configured)
```

---

## 🔧 **Common Commands**

### **Backend (AWS EB)**

```powershell
cd Backend

# Deploy updates
eb deploy

# View logs
eb logs

# Check status
eb status

# Open in browser
eb open

# SSH into server
eb ssh
```

### **Frontend (Vercel)**

```powershell
cd Frontend

# Deploy
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## 🚨 **Troubleshooting**

### **Problem: Backend health check fails**

```powershell
# Check logs
cd Backend
eb logs

# Common fixes:
# 1. Verify MongoDB connection string
# 2. Check environment variables
# 3. Ensure PORT=8080
```

### **Problem: Frontend can't connect to backend**

```powershell
# 1. Check environment variable
cd Frontend
cat .env.production

# 2. Verify CORS on backend
cd Backend
eb printenv | findstr FRONTEND_URL

# 3. Update CORS
eb setenv FRONTEND_URL=https://your-frontend.vercel.app
eb deploy
```

### **Problem: "Route not found" errors**

```powershell
# Backend is running but endpoints missing
cd Backend
eb deploy  # Redeploy latest code
```

---

## 📚 **Full Documentation**

- **Complete Guide:** `PRODUCTION-DEPLOYMENT-GUIDE.md`
- **AWS Deployment:** `Backend/AWS_DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** `Backend/TROUBLESHOOTING.md`

---

## 🎯 **What You Get**

**Production Application:**
- ✅ Scalable backend on AWS Elastic Beanstalk
- ✅ Fast frontend on Vercel CDN
- ✅ Secure MongoDB Atlas database
- ✅ AI-powered recommendations via AWS Bedrock
- ✅ Automatic HTTPS on frontend
- ✅ Global CDN distribution
- ✅ Auto-scaling capabilities

**All CRUD operations:**
- ✅ Income management
- ✅ Asset tracking
- ✅ Liability management
- ✅ Credit card monitoring
- ✅ AI financial recommendations

---

## 🎉 **Success!**

Your local development app is now a production-ready application accessible from anywhere in the world!

**Next steps:**
1. Share the URL with users
2. Add custom domain (optional)
3. Set up monitoring
4. Plan new features

---

**Need help?** Read the full guide: `PRODUCTION-DEPLOYMENT-GUIDE.md`
