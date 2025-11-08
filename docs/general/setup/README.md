# 💰 Wealth Management System

A full-stack wealth management application with AI-powered recommendations.

---

## 🎯 **DEPLOYMENT OPTIONS**

### **Local Development (You are here)**
- ✅ Running on localhost
- ✅ Perfect for testing and development
- 📖 Follow instructions below

### **Production Deployment** 🚀
- 🌍 Deploy to the cloud (AWS + Vercel)
- 🚀 Accessible from anywhere
- 📖 **See:** [QUICK-DEPLOYMENT.md](QUICK-DEPLOYMENT.md) or [README-PRODUCTION.md](README-PRODUCTION.md)

---

## ✅ **QUICK START (Recommended)**

### **Step 1: Run the Cleanup Script**

This kills all old processes and starts fresh:

```powershell
.\cleanup-and-start.ps1
```

**What it does:**
- ✅ Kills all Node.js processes
- ✅ Frees up ports 3000, 3001, 3002, 3003, 5000
- ✅ Starts backend in new terminal
- ✅ Starts frontend in new terminal
- ✅ Verifies everything is running

### **Step 2: Open Your Browser**

Wait 10 seconds, then open:
```
http://localhost:3000
```

### **Step 3: Start Adding Your Financial Data!**

---

## 🐛 **Common Problems & Solutions**

### ❌ Problem: Backend Crashes with MongoDB Error

**Error Message:**
```
❌ Error: querySrv ECONNREFUSED _mongodb._tcp.wealthplanner.mvpovg3.mongodb.net
[nodemon] app crashed - waiting for file changes before starting...
```

**✅ Solution:**

**Root Cause:** MongoDB connection string was incomplete (missing database name)

**Fixed in:** `Backend/.env`

```env
# ❌ WRONG (old):
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# ✅ CORRECT (fixed):
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/wealthdb?retryWrites=true&w=majority
```

**The connection string MUST include:**
1. Database name (`wealthdb`)
2. Query parameters (`?retryWrites=true&w=majority`)

---

### ❌ Problem: Frontend Port Keeps Changing (3001, 3002, 3003...)

**Why This Happens:**
Multiple frontend instances are running! Each new instance finds port 3000 occupied, so it uses 3001, then 3002, etc.

**✅ Solution:**

**Option 1: Use the cleanup script (easiest):**
```powershell
.\cleanup-and-start.ps1
```

**Option 2: Manual cleanup:**
```powershell
# Kill all Node.js processes
Get-Process node | Stop-Process -Force

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start backend
cd Backend
npm run dev

# In another terminal, start frontend
cd Frontend
npm run dev
```

**Option 3: Kill specific ports:**
```powershell
# Find processes
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill each PID
taskkill /F /PID <number>
```

---

### ❌ Problem: Cannot Add Data from Frontend

**Error:** "Failed to fetch"

**Possible Causes & Solutions:**

#### Cause 1: Backend is crashed
```powershell
# Check backend logs - if you see:
# [nodemon] app crashed - waiting for file changes before starting...

# Solution: Restart backend
cd Backend
npm run dev
```

#### Cause 2: Backend running but wrong port
```powershell
# Verify backend is on port 5000:
Invoke-RestMethod -Uri "http://localhost:5000/health"

# Should return: status: OK
```

#### Cause 3: Frontend on wrong port
```powershell
# If frontend is on 3001, 3002, etc., the API might not connect properly
# Solution: Use cleanup script to restart on port 3000
.\cleanup-and-start.ps1
```

#### Cause 4: CORS issues
```powershell
# Check Backend/.env has:
FRONTEND_URL=http://localhost:3000

# If frontend is on different port (e.g., 3001), update it:
FRONTEND_URL=http://localhost:3001
```

---

## 🎯 **How to Use the Application**

### 1. **Add Income**
- Navigate to "Income" page
- Click "Add Income" button
- Fill in:
  - Source: e.g., "Monthly Salary"
  - Amount: e.g., 5000
  - Currency: LKR, USD, or EUR
  - Frequency: monthly, weekly, etc.
- Click "Add Income"
- ✅ Income saved!

### 2. **Add Assets**
- Navigate to "Assets" page
- Click "Add Asset"
- Fill in:
  - Name: e.g., "Savings Account"
  - Type: property, investment, saving, or other
  - Value: e.g., 10000
  - Currency: LKR, USD, or EUR
- ✅ Asset saved!

### 3. **Add Liabilities**
- Navigate to "Liabilities"
- Click "Add Liability"
- Fill in:
  - Name: e.g., "Car Loan"
  - Type: loan, mortgage, or other
  - Amount: e.g., 5000
  - Currency: LKR, USD, or EUR
  - Interest Rate: e.g., 5.5
- ✅ Liability saved!

### 4. **Add Credit Cards**
- Navigate to "Credit Cards"
- Click "Add Credit Card"
- Fill in details
- ✅ Card saved!

### 5. **Get AI Recommendations**
- Navigate to "Recommendations"
- Click "Generate Recommendations"
- AI analyzes your data and provides personalized advice
- ✅ View your recommendations!

---

## 📊 **Architecture**

```
Frontend (Next.js 15, React 18, TypeScript)
    ↓ HTTP Requests via Fetch API
Backend (Node.js, Express.js)
    ↓ Mongoose ODM
MongoDB Atlas (Cloud Database)

Backend → AWS Bedrock (AI Recommendations)
```

---

## 🔧 **Environment Variables**

### Backend `.env`
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/wealthdb?retryWrites=true&w=majority
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ANTHROPIC_VERSION=bedrock-2023-05-31
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 **Testing**

### Test Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

### Test API Endpoint
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/income"
```

### Test POST Request
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/income" -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"source":"Test","amount":1000,"currency":"USD","frequency":"monthly"}'
```

---

## 📚 **Documentation**

- **Backend Docs:** `Backend/README.md`
- **Frontend Docs:** `Frontend/README.md`
- **API Reference:** `Backend/documentation/API.md`
- **Architecture:** `Backend/documentation/ARCHITECTURE.md`
- **Security:** `Backend/documentation/SECURITY.md`
- **Deployment:** `Backend/documentation/DEPLOYMENT.md`
- **Troubleshooting:** `Backend/TROUBLESHOOTING.md`

---

## 🛠️ **Scripts**

### `cleanup-and-start.ps1`
**Complete cleanup and restart** (recommended)
- Kills all Node processes
- Clears all ports
- Starts backend
- Starts frontend

### `start-servers.ps1`
**Quick start** (use if ports are free)
- Checks and frees ports if needed
- Starts both servers

---

## 🚨 **Emergency Fixes**

### Nothing Works?

Run this:
```powershell
# Nuclear option - kill everything and restart
Get-Process node | Stop-Process -Force
Start-Sleep -Seconds 3
.\cleanup-and-start.ps1
```

### Still Not Working?

1. Check MongoDB Atlas is running
2. Verify `.env` file has correct MongoDB URI
3. Check AWS credentials are valid
4. Review `Backend/TROUBLESHOOTING.md`

---

## ✅ **Current Status**

Both servers should be running:

- ✅ **Backend:** http://localhost:5000
  - Database: MongoDB Atlas (Connected)
  - API: RESTful endpoints
  - AI: AWS Bedrock integration

- ✅ **Frontend:** http://localhost:3000
  - Framework: Next.js 15
  - UI: React 18 + Tailwind CSS
  - Charts: Recharts
  - Forms: React Hook Form + Zod

---

## 🎉 **You're Ready!**

Click the preview button or open http://localhost:3000 and start managing your wealth! 💰📈

For issues, check `Backend/TROUBLESHOOTING.md`
