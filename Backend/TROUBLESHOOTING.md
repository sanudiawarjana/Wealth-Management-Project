# 🔧 Troubleshooting Guide

## ⚠️ MOST COMMON ISSUE: Backend Keeps Crashing

**Problem:** You try to add data in the frontend, but nothing saves. Backend shows:
```
[nodemon] app crashed - waiting for file changes before starting...
```

**Quick Fix:**

1. **Kill old backend process:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Look for the PID (last column)

# Kill it
taskkill /F /PID <number>
```

2. **Restart backend:**
```bash
cd Backend
npm run dev
```

3. **Verify it's working:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
# Should return: status: OK
```

4. **Refresh your browser** (F5 or Ctrl+R)

**Now try adding data again - it should work!**

---

## Common Issues and Solutions

### 1. Backend Won't Start

**Problem:** Server crashes immediately after starting

**Symptoms:**
```
[nodemon] app crashed - waiting for file changes before starting...
```

**Solution:**
✅ **FIXED** - Added `require('dotenv').config();` to the top of `server.js`

**Cause:** Environment variables weren't being loaded, causing the server to crash when trying to access `process.env` variables.

**How to verify fix:**
```bash
cd Backend
npm run dev

# Should see:
# [SUCCESS] Database connected successfully
# [SUCCESS] 🚀 Server running on port 5000
```

---

### 2. Frontend Can't Connect to Backend

**Problem:** Frontend shows "Network error" or no data loads

**Common Causes:**

#### Cause A: Backend not running
```bash
# Check if backend is running
curl http://localhost:5000/health

# If error, start backend:
cd Backend
npm run dev
```

#### Cause B: Wrong API URL in frontend
```bash
# Check Frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# If missing, create the file with above content
```

#### Cause C: CORS issues
```bash
# Check Backend/.env
FRONTEND_URL=http://localhost:3000

# Should match your frontend URL
```

#### Cause D: Port conflicts
```bash
# Backend should be on port 5000
# Frontend should be on port 3000

# If ports conflict:
# Kill process: taskkill /F /PID <pid>
# Restart servers
```

---

### 3. Environment Variables Not Loading

**Problem:** Server can't find MongoDB URI or AWS credentials

**Solution:**

1. **Check .env file exists in Backend/**
```bash
ls Backend/.env
```

2. **Verify .env format:**
```env
MONGO_URI=mongodb+srv://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

3. **Ensure dotenv is loaded in server.js:**
```javascript
require('dotenv').config(); // MUST be first line
```

4. **Restart server after changing .env:**
```bash
# Nodemon should auto-restart, or manually:
npm run dev
```

---

### 4. Database Connection Fails

**Problem:** 
```
Failed to connect to MongoDB
```

**Solutions:**

1. **Check MongoDB URI:**
```env
# In Backend/.env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

2. **Verify MongoDB Atlas:**
- Network access allows your IP
- Database user exists
- Password is correct
- Cluster is running

3. **Test connection:**
```bash
# Backend should log:
# 📦 MongoDB Connected: ...
# [SUCCESS] Database connected successfully
```

---

### 5. Frontend on Wrong Port

**Problem:** Frontend starts on port 3003 instead of 3000

**Cause:** Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /F /PID <pid>

# Restart frontend
cd Frontend
npm run dev
```

---

### 6. CORS Errors in Browser

**Problem:** Browser console shows CORS errors

**Solution:**

1. **Check backend CORS configuration:**
```javascript
// In server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
```

2. **Verify FRONTEND_URL in Backend/.env:**
```env
FRONTEND_URL=http://localhost:3000
```

3. **Restart backend after changes**

---

### 7. API Returns 404

**Problem:** API endpoint returns "Route not found"

**Solutions:**

1. **Check endpoint URL:**
```javascript
// Correct:
http://localhost:5000/api/income

// Wrong:
http://localhost:5000/income (missing /api)
```

2. **Verify route is registered in server.js:**
```javascript
app.use('/api/income', incomeRoutes);
```

3. **Check API.md documentation for correct endpoints**

---

### 8. Validation Errors

**Problem:** API returns 400 validation error

**Example:**
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

**Solution:** Fix the data being sent

**Common validations:**
- `source`: 2-100 characters
- `amount`: Positive number
- `currency`: Must be "LKR", "USD", or "EUR"
- `frequency`: Must be valid frequency value

---

### 9. Rate Limit Exceeded

**Problem:** 
```json
{
  "error": "Too many requests",
  "message": "Please try again later"
}
```

**Cause:** Exceeded rate limits:
- General API: 100 requests per 15 minutes
- AI endpoints: 10 requests per hour

**Solution:** Wait for the time window to reset

---

### 10. AWS Bedrock Errors

**Problem:** AI recommendations fail

**Solutions:**

1. **Check AWS credentials in Backend/.env:**
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

2. **Verify Bedrock model access:**
- Go to AWS Console → Bedrock
- Request model access for Claude 3 Sonnet

3. **Check IAM permissions:**
- User needs `bedrock:InvokeModel` permission

---

## Quick Diagnostic Commands

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### Check API Endpoints
```bash
curl http://localhost:5000/api/income
```

### Check Backend Logs
```bash
# In Backend terminal
# Look for errors in red
```

### Check Frontend Logs
```bash
# In Frontend terminal
# Look for compilation errors
```

### Verify Environment Variables
```bash
# Backend
cd Backend
cat .env

# Frontend
cd Frontend
cat .env.local
```

---

## Restart Everything

If all else fails, restart both servers:

```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

Wait for both to show "Ready" before testing.

---

## Getting Help

If issues persist:

1. Check logs in Backend/src/logs/
2. Check browser console (F12)
3. Verify all environment variables are set
4. Test backend API directly with curl
5. Check documentation files

---

**Last Updated:** October 2025
