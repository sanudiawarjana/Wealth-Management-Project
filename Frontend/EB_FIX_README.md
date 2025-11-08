# Elastic Beanstalk Deployment Fix

## Issues Identified
Your deployment was failing because:
1. ❌ Missing `server.js` file
2. ❌ Missing `Procfile` 
3. ❌ Missing `.ebextensions` configuration
4. ❌ Missing `.platform` nginx configuration
5. ❌ Node.js version incompatibility (22.x not supported)

## ✅ Fixes Applied

### 1. Created `server.js`
Custom server to run Next.js on port 8080 (Elastic Beanstalk default)

### 2. Created `Procfile`
Tells Elastic Beanstalk how to start the application

### 3. Created `.ebextensions/`
- `nodecommand.config` - Sets Node environment and port
- `nginx.config` - Configures Nginx settings

### 4. Created `.platform/nginx/conf.d/`
- `00_application.conf` - Proxy configuration for Next.js

### 5. Updated `package.json`
Changed Node.js version from `>=22.0.0` to `18.x || 20.x` for compatibility

## 🚀 Deploy Steps

### Option A: Quick Deploy (Recommended)
```powershell
cd Frontend
.\deploy-to-eb.ps1
```

Then run:
```bash
eb deploy WealthManagementFrontend-env
```

### Option B: Manual Deploy
```powershell
# 1. Clean and build
cd Frontend
Remove-Item -Recurse -Force .next, node_modules -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
npm run build

# 2. Deploy
eb deploy WealthManagementFrontend-env

# 3. Monitor
eb logs --follow
```

## 🔍 Verify Deployment

### Check Health
```bash
eb health
```

### View Logs
```bash
eb logs --follow
```

### Check Instance
```bash
eb ssh
# Then on instance:
sudo tail -f /var/log/eb-engine.log
sudo tail -f /var/log/nodejs/nodejs.log
```

## ⚙️ Environment Variables

Ensure your `.env.production` contains:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url.elasticbeanstalk.com/api
```

## 🔧 Troubleshooting

### If deployment still fails:

1. **Check Node version on EB:**
   ```bash
   eb ssh
   node --version
   ```
   Should be 18.x or 20.x

2. **Check build output:**
   ```bash
   eb logs
   ```
   Look for build errors in eb-engine.log

3. **Verify files in deployment:**
   ```bash
   eb ssh
   cd /var/app/current
   ls -la
   ```
   Should see: server.js, .next/, package.json, etc.

4. **Check application is running:**
   ```bash
   eb ssh
   curl http://localhost:8080
   ```

### Common Fixes:

**Port Issues:**
```yaml
# .ebextensions/nodecommand.config should have:
PORT: 8080
```

**Build Memory Issues:**
If build runs out of memory, add to `.ebextensions/`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node --max-old-space-size=2048 node_modules/.bin/next start"
```

**Nginx Timeout:**
Add to `.ebextensions/nginx.config`:
```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    content: |
      proxy_read_timeout 300;
      proxy_connect_timeout 300;
```

## 📊 Health Check

Your instance should show:
- ✅ Status: Ok
- ✅ Running time: > 0
- ✅ Deployment ID: Current version
- ✅ 2xx Responses: Receiving traffic

## 🎯 Next Steps

1. Run the deployment script: `.\deploy-to-eb.ps1`
2. Deploy: `eb deploy WealthManagementFrontend-env`
3. Wait 3-5 minutes for deployment to complete
4. Check health: `eb health`
5. Test your application URL

## 📞 If Still Having Issues

Share the output of:
```bash
eb logs > deployment-logs.txt
```

And check `/var/log/eb-engine.log` on the instance for specific errors.
