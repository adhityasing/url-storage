# Quick Deployment Summary

## 🚀 Deploy in 3 Steps

### 1️⃣ Railway: Set Up MySQL (5 minutes)

1. Go to [railway.app](https://railway.app) → New Project → Provision MySQL
2. Copy connection details from Variables tab:
   - `MYSQLHOST` → `DB_HOST`
   - `MYSQLPORT` → `DB_PORT` 
   - `MYSQLUSER` → `DB_USER`
   - `MYSQLPASSWORD` → `DB_PASSWORD`
   - `MYSQLDATABASE` → `DB_NAME`

### 2️⃣ Vercel: Deploy Backend (5 minutes)

1. [vercel.com](https://vercel.com) → Add New Project → Import repo
2. **Settings:**
   - Root Directory: `backend`
   - Framework: Other
3. **Environment Variables:**
   ```
   DB_HOST=your-railway-host
   DB_PORT=3306
   DB_USER=your-railway-user
   DB_PASSWORD=your-railway-password
   DB_NAME=your-railway-database
   NODE_ENV=production
   BASE_URL=https://your-backend.vercel.app
   ```
4. Deploy → Copy backend URL

### 3️⃣ Vercel: Deploy Frontend (5 minutes)

1. Vercel → Add New Project → Same repo
2. **Settings:**
   - Root Directory: `frontend`
   - Framework: Create React App
3. **Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```
4. Deploy → Done! 🎉

---

## 📋 Your URLs

After deployment, you'll have:

- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`
- **Database**: Railway MySQL (internal)

---

## ✅ Test It

1. **Backend**: `https://your-backend.vercel.app/healthz`
2. **Frontend**: `https://your-frontend.vercel.app`
3. **Create a link** and test redirect

---

## 📚 Detailed Guides

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **Railway Setup**: `RAILWAY_SETUP.md`
- **Vercel Setup**: `VERCEL_SETUP.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

## ⚠️ Common Mistakes

1. ❌ Forgetting to set Root Directory (`backend` or `frontend`)
2. ❌ Wrong environment variable names
3. ❌ Using localhost URLs in production
4. ❌ Not updating `BASE_URL` after first deploy

---

## 🆘 Need Help?

Check the detailed guides or:
- Vercel logs: Dashboard → Your Project → Deployments → Logs
- Railway logs: Railway Dashboard → Your Service → Logs

