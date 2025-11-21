# Deployment Checklist

Use this checklist to ensure everything is deployed correctly.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] All local tests pass
- [ ] `.env` files are NOT committed (they're in `.gitignore`)
- [ ] Railway account created
- [ ] Vercel account created

## Step 1: Railway Database

- [ ] Created new Railway project
- [ ] Provisioned MySQL service
- [ ] Copied database connection details:
  - [ ] Host
  - [ ] Port
  - [ ] Username
  - [ ] Password
  - [ ] Database name

## Step 2: Backend on Vercel

- [ ] Created new Vercel project for backend
- [ ] Set Root Directory to `backend`
- [ ] Framework Preset: Other
- [ ] Added environment variables:
  - [ ] `DB_HOST`
  - [ ] `DB_PORT`
  - [ ] `DB_USER`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `NODE_ENV=production`
  - [ ] `BASE_URL` (update after first deploy)
- [ ] Deployed backend
- [ ] Copied backend URL
- [ ] Tested `/healthz` endpoint
- [ ] Updated `BASE_URL` with backend URL
- [ ] Redeployed backend

## Step 3: Frontend on Vercel

- [ ] Created new Vercel project for frontend
- [ ] Set Root Directory to `frontend`
- [ ] Framework Preset: Create React App
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Added environment variable:
  - [ ] `REACT_APP_API_URL` (backend URL)
- [ ] Deployed frontend
- [ ] Copied frontend URL

## Step 4: Testing

- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] Can create a link
- [ ] Can view links in dashboard
- [ ] Can delete a link
- [ ] Redirect works (`/backend-url/{code}`)
- [ ] Stats page works (`/frontend-url/code/{code}`)

## URLs to Save

- Backend URL: `https://________________.vercel.app`
- Frontend URL: `https://________________.vercel.app`
- Railway MySQL: `________________.railway.app`

## Troubleshooting Checklist

If something doesn't work:

- [ ] Check Vercel deployment logs
- [ ] Check Railway service logs
- [ ] Verify environment variables are set
- [ ] Test backend endpoints directly
- [ ] Check browser console for errors
- [ ] Verify CORS is working
- [ ] Check database connection

