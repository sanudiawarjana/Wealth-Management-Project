# 🚀 WealthTrack - START HERE

## ⚠️ IMPORTANT: Your Issue Explained

### Why You Cannot Add Income:

**❌ Your backend server is NOT running!**

The frontend needs the backend to save data. Without it running, nothing will save.

---

## ✅ SOLUTION (3 Simple Steps)

### Step 1: Fix PowerShell Errors

Your PowerShell profile has wrong content. Fix it:

1. **Open Notepad as Administrator**
2. **Open this file:**
   ```
   C:\Users\ASUS\OneDrive\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
   ```
3. **Delete EVERYTHING and replace with:**
   ```powershell
   # PowerShell Profile
   ```
4. **Save and close Notepad**
5. **Close ALL PowerShell windows**

### Step 2: Start Both Servers

**Double-click this file:**
```
d:\AI Boot Camp\START-EVERYTHING.bat
```

This will:
- ✅ Open 2 new command windows
- ✅ Start backend on `http://localhost:5000`
- ✅ Start frontend on `http://localhost:3000`
- ✅ Install dependencies if needed

**Keep both windows open!** Don't close them.

### Step 3: Test Your App

1. **Wait 15 seconds** for servers to start
2. **Open browser:** `http://localhost:3000`
3. **Click "Income" in the menu**
4. **Click "Add Income" button**
5. **Fill the form:**
   - Source: Salary
   - Amount: 100000
   - Currency: LKR  
   - Frequency: Monthly
6. **Click "Add Income"**
7. **You should see a green success message!** ✅
8. **Refresh the page (F5)**
9. **Your income should still be there!** ✅

---

## 🔍 Verify It's Working

### Check Backend:
```
http://localhost:5000/health
```
Should show: `{"status":"OK",...}`

### Check Frontend:
```
http://localhost:3000
```
Should open your WealthTrack app

### Check Browser Console:
1. Press F12
2. Go to Console tab
3. Should see NO red errors

---

## ❌ Troubleshooting

### Problem: "Port 5000 already in use"

**Solution:**
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find "Node.js" processes
3. End them all
4. Run START-EVERYTHING.bat again

### Problem: "Cannot find module"

**Solution:**
1. Close both server windows
2. Delete these folders:
   - `d:\AI Boot Camp\Backend\node_modules`
   - `d:\AI Boot Camp\Frontend\node_modules`
3. Run START-EVERYTHING.bat again

### Problem: Frontend loads but adding income doesn't work

**Check:**
1. Is backend window still open and running?
2. Go to `http://localhost:5000/health` - does it work?
3. Open browser DevTools (F12) → Network tab
4. Try adding income
5. Look for red errors

---

## 📋 Quick Checklist

Before using the app:

- [ ] PowerShell profile fixed (no errors)
- [ ] Ran START-EVERYTHING.bat
- [ ] Two windows opened (Backend and Frontend)
- [ ] Waited 15 seconds
- [ ] Opened http://localhost:3000
- [ ] No errors in browser console (F12)

---

## 🎯 What to Expect

**Backend Window:**
```
Server running on port 5000
Database connected successfully
```

**Frontend Window:**
```
- Local:        http://localhost:3000
✓ Ready in 3.2s
```

**Browser:**
- App loads correctly ✅
- Can add income ✅
- Data saves ✅  
- Data persists after refresh ✅

---

## 🚫 Common Mistakes

1. ❌ **Only starting frontend** - Backend MUST run too
2. ❌ **Closing server windows** - Keep them open!
3. ❌ **Not waiting** - Give servers 15 seconds to start
4. ❌ **Wrong URL** - Use `localhost:3000` not `127.0.0.1:3000`

---

## 📱 For Vercel Production

Once local works:

1. **Go to Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Add:**
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api
   ```
   ⚠️ **MUST be HTTPS (not HTTP)**
4. **Redeploy**

---

## 💡 Pro Tips

1. **Bookmark http://localhost:3000** for easy access
2. **Keep server windows minimized** - don't close them
3. **Check console first** (F12) if something doesn't work
4. **Restart servers** if weird issues occur (close windows, run bat file again)

---

## 📞 Still Having Issues?

If still not working, check:

1. **Backend window** - any errors?
2. **Frontend window** - any errors?
3. **Browser console (F12)** - any red errors?
4. **MongoDB** - is your connection string correct?

Share screenshots of:
- Backend terminal
- Frontend terminal  
- Browser console
- Error messages

---

## ✅ Success Indicators

You know it's working when:

✅ Backend window shows "Server running on port 5000"
✅ Frontend window shows "Local: http://localhost:3000"
✅ Browser loads the app
✅ No red errors in console
✅ Adding income shows green success message
✅ Refreshing page keeps the data

---

## 🎉 That's It!

Just run **START-EVERYTHING.bat** and you're good to go!

---

## 📚 Additional Files

- `QUICK_FIX_CANNOT_ADD_INCOME.md` - Detailed troubleshooting
- `QUICK_FIX_SUMMARY.md` - Responsive layout fixes
- `VERCEL_DEPLOYMENT_FIX.md` - Production deployment
- `DEPLOYMENT_CHECKLIST_VISUAL.txt` - Visual deployment guide

---

**Need help? Read the detailed guides above!** 📖
