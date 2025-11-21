# Complete Deployment Guide: Vercel + Railway

This guide will help you deploy TinyLink with:
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Vercel (separate project)
- **Database**: MySQL on Railway

## Prerequisites

1. GitHub account
2. Vercel account (free tier) - [Sign up](https://vercel.com)
3. Railway account (free tier) - [Sign up](https://railway.app)
4. Your code pushed to a GitHub repository

---

## Step 1: Set Up MySQL Database on Railway

### 1.1 Create Railway Account and Project

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Provision MySQL"** (or search for MySQL in the template list)

### 1.2 Get Database Connection Details

1. Once MySQL is provisioned, click on the MySQL service
2. Go to the **"Variables"** tab
3. You'll see connection details. Railway provides:
   - `MYSQLHOST` (host)
   - `MYSQLPORT` (port, usually 3306)
   - `MYSQLUSER` (username)
   - `MYSQLPASSWORD` (password)
   - `MYSQLDATABASE` (database name)

### 1.3 Create Connection String (Optional)

You can use either:
- **Option A**: Individual variables (recommended for Railway)
- **Option B**: Connection string format: `mysql://user:password@host:port/database`

**Note**: Railway's MySQL uses these specific variable names. You'll need to map them to your app's expected variables.

---

## Step 2: Deploy Backend to Vercel

### 2.1 Prepare Backend for Deployment

1. Make sure your code is pushed to GitHub
2. Verify `backend/vercel.json` exists (it should already be there)

### 2.2 Create Backend Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this!**
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### 2.3 Configure Backend Environment Variables

In Vercel project settings, go to **Settings → Environment Variables** and add:

**Option A: Using Railway's Variable Names (Recommended)**
```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}
NODE_ENV=production
PORT=3001
BASE_URL=https://your-backend-project.vercel.app
```

**Option B: Using Connection String**
```
DATABASE_URL=mysql://user:password@host:port/database
NODE_ENV=production
PORT=3001
BASE_URL=https://your-backend-project.vercel.app
```

**Important Notes:**
- Replace `your-backend-project.vercel.app` with your actual Vercel backend URL (you'll get this after first deployment)
- For Railway variables, you'll need to manually copy the values from Railway and paste them
- Railway doesn't expose variables directly to Vercel, so you'll need to copy the actual values

### 2.4 Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy your backend URL** (e.g., `https://tinylink-backend.vercel.app`)
4. **Update the `BASE_URL` environment variable** with this URL
5. Redeploy (Vercel will auto-redeploy when you update env vars)

### 2.5 Test Backend

1. Visit: `https://your-backend-url.vercel.app/healthz`
2. You should see: `{"ok":true,"version":"1.0","uptime":...}`
3. If you see errors, check the deployment logs in Vercel

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Frontend Project on Vercel

1. In Vercel Dashboard, click **"Add New Project"** again
2. Import the **same GitHub repository**
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT: Set this!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3.2 Configure Frontend Environment Variables

In Vercel project settings, go to **Settings → Environment Variables** and add:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

**Important**: Replace `your-backend-url.vercel.app` with your actual backend URL from Step 2.4

### 3.3 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy your frontend URL** (e.g., `https://tinylink-frontend.vercel.app`)

### 3.4 Test Frontend

1. Visit your frontend URL
2. Try creating a link
3. Check if it connects to the backend

---

## Step 4: Update Backend BASE_URL (Optional)

If you want redirects to work through the frontend domain, update the backend's `BASE_URL`:

1. Go to backend project in Vercel
2. Settings → Environment Variables
3. Update `BASE_URL` to your frontend URL (or keep it as backend URL)
4. Redeploy

---

## Step 5: Verify Everything Works

### Test Checklist:

- [ ] Backend health check: `https://your-backend.vercel.app/healthz` returns 200
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Can create a link from frontend
- [ ] Can view links in dashboard
- [ ] Redirect works: `https://your-backend.vercel.app/{code}` redirects properly
- [ ] Stats page works: `https://your-frontend.vercel.app/code/{code}`

---

## Troubleshooting

### Backend Issues

**"Database connection failed"**
- Check Railway MySQL is running
- Verify environment variables are set correctly in Vercel
- Check Railway connection details match your env vars
- Ensure SSL is enabled for production (Railway requires it)

**"Table doesn't exist"**
- Check Vercel deployment logs
- The schema should auto-create on first request
- You can manually trigger: visit `/healthz` endpoint

**"Internal server error"**
- Check Vercel function logs
- Look for detailed error messages
- Verify database credentials

### Frontend Issues

**"Failed to fetch" or CORS errors**
- Verify `REACT_APP_API_URL` points to correct backend URL
- Check backend CORS settings (should allow all origins)
- Ensure backend is deployed and accessible

**"API URL not found"**
- Check `REACT_APP_API_URL` environment variable
- Rebuild frontend after changing env vars
- Clear browser cache

### Railway Issues

**Can't connect to database**
- Verify MySQL service is running in Railway
- Check connection variables are correct
- Railway provides connection details in the Variables tab
- For production, ensure SSL is enabled

---

## Environment Variables Summary

### Backend (Vercel)
```
DB_HOST=your-railway-host
DB_PORT=3306
DB_USER=your-railway-user
DB_PASSWORD=your-railway-password
DB_NAME=your-railway-database
NODE_ENV=production
PORT=3001
BASE_URL=https://your-backend.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

### Railway MySQL
Railway provides these automatically:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

---

## Important Notes

1. **Root Directory**: Must be set correctly (`backend` or `frontend`)
2. **Environment Variables**: Must be set in each Vercel project separately
3. **Database**: Schema auto-creates on first backend request
4. **SSL**: Railway MySQL requires SSL in production (handled automatically)
5. **Redeploy**: After changing env vars, Vercel auto-redeploys
6. **URLs**: Keep track of both frontend and backend URLs

---

## Quick Reference

### Backend URL Structure
- Health: `https://backend.vercel.app/healthz`
- API: `https://backend.vercel.app/api/links`
- Redirect: `https://backend.vercel.app/{code}`

### Frontend URL Structure
- Dashboard: `https://frontend.vercel.app/`
- Stats: `https://frontend.vercel.app/code/{code}`

### Testing Commands

```bash
# Test backend health
curl https://your-backend.vercel.app/healthz

# Test create link
curl -X POST https://your-backend.vercel.app/api/links \
  -H "Content-Type: application/json" \
  -d '{"target_url": "https://example.com"}'
```

---

## Next Steps

1. ✅ Database set up on Railway
2. ✅ Backend deployed on Vercel
3. ✅ Frontend deployed on Vercel
4. ✅ Environment variables configured
5. ✅ Test all functionality
6. 🎉 Your URL shortener is live!

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Railway service logs
3. Verify all environment variables
4. Test endpoints individually
5. Check browser console for frontend errors

