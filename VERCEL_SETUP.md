# Vercel Deployment - Step by Step

## Backend Deployment on Vercel

### Step 1: Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 2: Configure Backend Project

**Project Settings:**
- **Project Name**: `tinylink-backend` (or your choice)
- **Framework Preset**: **Other**
- **Root Directory**: `backend` ⚠️ **CRITICAL: Click "Edit" and set this!**
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### Step 3: Environment Variables

Click **"Environment Variables"** and add:

```
DB_HOST=your-railway-host
DB_PORT=3306
DB_USER=your-railway-user
DB_PASSWORD=your-railway-password
DB_NAME=your-railway-database
NODE_ENV=production
PORT=3001
BASE_URL=https://tinylink-backend.vercel.app
```

**Note**: Update `BASE_URL` after first deployment with your actual backend URL.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy the deployment URL (e.g., `tinylink-backend.vercel.app`)

### Step 5: Update BASE_URL

1. Go to **Settings** → **Environment Variables**
2. Update `BASE_URL` with your actual backend URL
3. Vercel will auto-redeploy

### Step 6: Test Backend

Visit: `https://your-backend-url.vercel.app/healthz`

Should return: `{"ok":true,"version":"1.0","uptime":...}`

---

## Frontend Deployment on Vercel

### Step 1: Create New Project

1. In Vercel Dashboard, click **"Add New Project"** again
2. Select the **same GitHub repository**
3. Click **"Import"**

### Step 2: Configure Frontend Project

**Project Settings:**
- **Project Name**: `tinylink-frontend` (or your choice)
- **Framework Preset**: **Create React App**
- **Root Directory**: `frontend` ⚠️ **CRITICAL: Click "Edit" and set this!**
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 3: Environment Variables

Click **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

**Important**: Use your actual backend URL from the backend deployment.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes for first build)
3. Copy the deployment URL

### Step 5: Test Frontend

1. Visit your frontend URL
2. Try creating a link
3. Verify it connects to backend

---

## Vercel Configuration Files

Your project already has the correct `vercel.json` files:

- `backend/vercel.json` - Backend serverless configuration
- `frontend/vercel.json` - Frontend SPA configuration

These are automatically detected by Vercel.

---

## Important Vercel Settings

### Root Directory

**CRITICAL**: You must set the root directory for each project:
- Backend: `backend`
- Frontend: `frontend`

If you don't set this, Vercel will try to build from the root and fail.

### Environment Variables

- Set separately for each project (backend and frontend)
- Changes trigger automatic redeployment
- Use `${{VARIABLE}}` for referencing other variables (not needed here)

### Custom Domains

You can add custom domains later:
1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

---

## Vercel Deployment Tips

### Build Logs

- Check build logs if deployment fails
- Look for error messages
- Common issues: missing dependencies, build errors

### Function Logs

- View serverless function logs in Vercel dashboard
- Useful for debugging backend issues
- Real-time logs available

### Redeployment

- Automatic on Git push (if connected)
- Manual redeploy: **Deployments** → **Redeploy**
- Environment variable changes trigger redeploy

### Preview Deployments

- Every branch gets a preview URL
- Test changes before merging
- Useful for development

---

## Troubleshooting Vercel

### Build Fails

**Backend:**
- Check Node.js version (should be 18+)
- Verify `package.json` has all dependencies
- Check for syntax errors

**Frontend:**
- Verify React build completes locally
- Check for missing dependencies
- Verify environment variables are set

### Function Timeout

- Vercel free tier: 10 seconds max
- Database initialization might take time
- Consider optimizing initialization

### Environment Variables Not Working

- Verify variable names are correct
- Check for typos
- Ensure variables are set for correct environment (Production)
- Redeploy after changing variables

### CORS Issues

- Backend CORS is configured to allow all origins
- If issues persist, check backend logs
- Verify `REACT_APP_API_URL` is correct

---

## Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-hours/month
- **Builds**: Unlimited
- **Perfect for**: Small to medium projects

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Verify database connection
3. ✅ Test frontend-backend communication
4. ✅ Set up custom domain (optional)
5. ✅ Monitor usage in Vercel dashboard

