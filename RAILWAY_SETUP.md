# Railway MySQL Setup - Detailed Guide

## Step-by-Step Railway Setup

### 1. Sign Up / Sign In

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub (recommended)

### 2. Create MySQL Database

1. Click **"New Project"**
2. Select **"Provision MySQL"** from the template list
   - OR click **"New"** → **"Database"** → **"Add MySQL"**

3. Wait for MySQL to provision (takes ~30 seconds)

### 3. Get Connection Details

1. Click on the **MySQL** service in your project
2. Go to the **"Variables"** tab
3. You'll see these variables:

```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=your-password-here
MYSQLDATABASE=railway
```

### 4. Copy These Values

**Important**: Copy each value. You'll need them for Vercel environment variables.

- `MYSQLHOST` → Use as `DB_HOST` in Vercel
- `MYSQLPORT` → Use as `DB_PORT` in Vercel (usually 3306)
- `MYSQLUSER` → Use as `DB_USER` in Vercel
- `MYSQLPASSWORD` → Use as `DB_PASSWORD` in Vercel
- `MYSQLDATABASE` → Use as `DB_NAME` in Vercel

### 5. Alternative: Use Connection String

You can also create a connection string:

```
mysql://MYSQLUSER:MYSQLPASSWORD@MYSQLHOST:MYSQLPORT/MYSQLDATABASE
```

Example:
```
mysql://root:password123@containers-us-west-xxx.railway.app:3306/railway
```

Use this as `DATABASE_URL` in Vercel.

## Railway Free Tier Limits

- **Storage**: 1 GB
- **Usage**: 500 hours/month
- **Perfect for**: Development and small projects

## Security Notes

- Railway automatically handles SSL/TLS
- Connection strings include credentials - keep them secret
- Never commit connection strings to Git

## Troubleshooting Railway

### Can't see MySQL service
- Refresh the page
- Check if provisioning is still in progress
- Try creating a new MySQL database

### Connection timeout
- Check if MySQL service is running (green status)
- Verify host/port are correct
- Check Railway service logs

### Access denied
- Verify username and password
- Check if database name is correct
- Ensure you're using the right connection details

## Railway Dashboard Tips

- **Metrics**: See database usage and connections
- **Logs**: View MySQL logs if needed
- **Settings**: Configure database settings
- **Variables**: View all connection variables

## Next Steps

After setting up Railway:
1. Copy all connection details
2. Use them in Vercel backend environment variables
3. Deploy backend to Vercel
4. Test connection

