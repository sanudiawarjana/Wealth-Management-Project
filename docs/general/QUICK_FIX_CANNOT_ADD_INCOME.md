# 🚨 QUICK FIX: Cannot Add Income Issue

## Problem
You cannot add income, assets, or any data in your frontend.

## Root Causes Found ✅

### 1. ❌ Backend Server Not Running
Your backend server at `http://localhost:5000` is **NOT running**. Without it, the frontend has nowhere to save data.

### 2. ❌ PowerShell Profile Error
Your PowerShell profile has Git configuration instead of PowerShell commands, causing errors on startup.

---

## ✅ SOLUTION - Follow These Steps

### Step 1: Fix PowerShell Profile

1. **Open this file in Notepad:**
   ```
   C:\Users\ASUS\OneDrive\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
   ```

2. **Delete ALL content and replace with:**
   ```powershell
   # PowerShell Profile
   # Your customizations here
   ```

3. **Save and close**

4. **Close ALL PowerShell windows and open a new one**

### Step 2: Start Your Backend Server

**Option A - Use the Automatic Script (RECOMMENDED):**

1. Open PowerShell
2. Navigate to project:
   ```powershell
   cd "d:\AI Boot Camp"
   ```
3. Run the script:
   ```powershell
   .\START-EVERYTHING.ps1
   ```

This will:
- ✅ Start backend on `http://localhost:5000`
- ✅ Start frontend on `http://localhost:3000`
- ✅ Open two new windows (one for each server)

**Option B - Manual Start:**

**Terminal 1 (Backend):**
```powershell
cd "d:\AI Boot Camp\Backend"
npm install
npm run dev
```
Keep this window open!

**Terminal 2 (Frontend):**
```powershell
cd "d:\AI Boot Camp\Frontend"
npm install
npm run dev
```
Keep this window open!

### Step 3: Test Your App

1. **Open browser:** `http://localhost:3000`
2. **Click "Add Income"**
3. **Fill in the form:**
   - Source: Salary
   - Amount: 100000
   - Currency: LKR
   - Frequency: Monthly
4. **Click "Add Income"**
5. **Refresh page (F5)**
6. **Income should still be there!** ✅

---

## 🔍 Verify Everything is Working

### Check Backend is Running:
```powershell
curl http://localhost:5000/health
```
Expected response:
```json
{"status":"OK","timestamp":"...","uptime":123}
```

### Check Frontend is Running:
```powershell
curl http://localhost:3000
```
Should return HTML content

### Check Browser Console:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try adding income
4. Should see NO red errors
5. Should see successful API calls in Network tab

---

## ❌ Still Not Working? Troubleshooting

### Problem: Backend won't start

**Check MongoDB Connection:**
1. Open `Backend\.env` or create it if missing
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   ```

**Check Backend logs:**
Look for errors in the backend terminal window

### Problem: "Port 5000 already in use"

**Kill the process:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual process ID)
taskkill /PID [PID] /F
```

### Problem: Frontend shows "Network Error"

**Verify:**
1. Backend is running (`http://localhost:5000/health`)
2. `.env.local` is correct:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Clear browser cache (Ctrl+Shift+R)

### Problem: Data disappears after refresh

**This means:**
- Backend is not saving to database
- Check MongoDB connection string
- Check backend console for errors

---

## 📋 Quick Checklist

Before asking for more help:

- [ ] PowerShell profile fixed (no errors on startup)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected (check backend logs)
- [ ] Browser console has no CORS errors
- [ ] Can access `http://localhost:5000/health`
- [ ] Can access `http://localhost:3000`

---

## 🎯 Expected Behavior

**When Everything Works:**

1. ✅ Open `http://localhost:3000`
2. ✅ Click "Add Income"
3. ✅ Fill form and submit
4. ✅ See success message (green toast)
5. ✅ Income appears in the list
6. ✅ Refresh page → income still there
7. ✅ No errors in console

**Terminal Windows:**

- **Backend Terminal:** Shows incoming requests
  ```
  POST /api/income 200 15ms
  GET /api/income 200 5ms
  ```

- **Frontend Terminal:** Shows page requests
  ```
  ○ Compiling /income ...
  ✓ Compiled /income
  ```

---

## 🚀 For Vercel Production

Once local development works:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix responsive layout and API issues"
   git push
   ```

2. **Set Vercel environment variable:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api
     ```
   - **MUST be HTTPS** (not HTTP)

3. **Redeploy**

---

## 💡 Prevention Tips

1. **Always check backend is running** before testing frontend
2. **Keep two terminal windows open** (one for backend, one for frontend)
3. **Check browser console** for errors (F12)
4. **Use the START-EVERYTHING.ps1 script** to start both servers easily

---

## 📞 Need More Help?

If still not working:

1. Share screenshot of:
   - Backend terminal window
   - Frontend terminal window
   - Browser console (F12)
   - Error messages

2. Share your `.env.local` file content

3. Run this command and share output:
   ```powershell
   curl http://localhost:5000/health
   ```

---

## ✅ Summary

**Main Issue:** Backend server was not running

**Solution:** 
1. Fix PowerShell profile
2. Start backend server
3. Start frontend server
4. Test adding income

**Quick Command:**
```powershell
cd "d:\AI Boot Camp"
.\START-EVERYTHING.ps1
```

Then open: `http://localhost:3000`

---

🎉 **Your app should now work perfectly!**
