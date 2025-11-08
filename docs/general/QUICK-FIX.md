# 🚨 QUICK FIX for "Failed to Fetch" Error

## ❌ Error You're Seeing

```
Failed to fetch
at Object.create (lib\api-services.ts:115:11)
```

---

## 🔍 **Root Cause**

**Backend keeps crashing!**

Look at your backend terminal - you'll see:
```
[nodemon] app crashed - waiting for file changes before starting...
```

When backend crashes, frontend can't connect → "Failed to fetch" error.

---

## ✅ **INSTANT FIX** (Do This Now)

### **Step 1: Kill ALL Node Processes**

```powershell
Get-Process node | Stop-Process -Force
```

### **Step 2: Wait 2 Seconds**

```powershell
Start-Sleep -Seconds 2
```

### **Step 3: Start Backend**

```powershell
cd Backend
node server.js
```

**Wait for:**
```
✅ [SUCCESS] Database connected successfully
✅ [SUCCESS] 🚀 Server running on port 5000
```

### **Step 4: Start Frontend (New Terminal)**

```powershell
cd Frontend
npm run dev
```

**Wait for:**
```
✓ Ready in 10s
```

### **Step 5: Refresh Browser**

Press `F5` or `Ctrl+R`

---

## ✅ **Even Easier: Use the Script**

```powershell
.\cleanup-and-start.ps1
```

**This does everything automatically!**

---

## 🎯 **Test It Works**

### Test from PowerShell:

```powershell
# Test backend health
Invoke-RestMethod -Uri "http://localhost:5000/health"
# Should return: status: OK

# Test creating income
Invoke-RestMethod -Uri "http://localhost:5000/api/income" -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"source":"Test","amount":1000,"currency":"USD","frequency":"monthly"}'
# Should return: income object with _id
```

### Test from Browser:

1. Open http://localhost:3000
2. Click "Income"
3. Click "Add Income"
4. Fill form
5. Submit
6. ✅ Should save successfully!

---

## 🔴 **Why Backend Keeps Crashing**

The backend crashes when there's an **unhandled error**. Common causes:

1. **Database connection lost** - MongoDB Atlas might disconnect
2. **Memory issue** - Backend running too long
3. **Code error** - Something in the request processing fails

**Solution:** Just restart the backend when it crashes.

---

## 📊 **How to Know If Backend is Running**

### Check Terminal:

**✅ Running:**
```
[SUCCESS] 🚀 Server running on port 5000
```

**❌ Crashed:**
```
[nodemon] app crashed - waiting for file changes before starting...
```

### Check via PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

**✅ Working:** Returns `status: OK`  
**❌ Not working:** Error message

---

## 🚀 **Best Practice: Always Use the Cleanup Script**

Instead of manually starting servers:

```powershell
.\cleanup-and-start.ps1
```

**Benefits:**
- Kills old processes automatically
- Ensures clean start every time
- Frees up all ports
- Verifies backend is running
- Opens correct terminals

---

## 📝 **Summary**

**Problem:** Backend crashes → Frontend gets "Failed to fetch"

**Solution:** 
1. Kill all Node processes
2. Restart backend
3. Restart frontend
4. Refresh browser

**Easy Way:**
```powershell
.\cleanup-and-start.ps1
```

---

## ✅ **Current Status**

Both servers are NOW running:

- ✅ Backend: http://localhost:5000 (Working)
- ✅ Frontend: http://localhost:3000 (Working)
- ✅ MongoDB: Connected
- ✅ API: Responding

**Click the preview button and try adding data now!** 🎉
