# TinyLink - URL Shortener

A full-stack URL shortener application built with Node.js, Express, React, and MySQL.

## Features

- ✅ Create short links with optional custom codes (6-8 alphanumeric characters)
- ✅ URL validation before saving
- ✅ Automatic redirect with click tracking
- ✅ Dashboard with link management (view, add, delete)
- ✅ Statistics page for individual links
- ✅ Search and filter functionality
- ✅ Health check endpoint
- ✅ Responsive design

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **Database**: MySQL
- **Hosting**: Vercel (Frontend & Backend)

## Project Structure

```
.
├── backend/
│   ├── db/
│   │   ├── schema.sql          # Database schema
│   │   └── init.js             # Database initialization
│   ├── routes/
│   │   ├── links.js            # API routes for links
│   │   ├── redirect.js         # Redirect handler
│   │   └── health.js           # Health check endpoint
│   ├── server.js               # Express server
│   ├── package.json
│   └── vercel.json             # Vercel configuration
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js    # Main dashboard
│   │   │   └── Stats.js        # Statistics page
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── vercel.json             # Vercel configuration
└── README.md
```

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

**Option 1: Using DATABASE_URL (MySQL connection string)**
```env
DATABASE_URL=mysql://user:password@host:port/database
PORT=3001
NODE_ENV=production
BASE_URL=https://your-backend-url.vercel.app
```

**Option 2: Using individual connection parameters**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tinylink
PORT=3001
NODE_ENV=production
BASE_URL=https://your-backend-url.vercel.app
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## Local Development

### Prerequisites

- Node.js 18+ installed
- MySQL database (local or remote)

### Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables (see above)

3. Start the backend:
```bash
cd backend
npm run dev
```

4. Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000` (frontend) and `http://localhost:3001` (backend).

## Database Setup

The database schema is automatically created when the backend starts. The `init.js` file will create the necessary tables if they don't exist.

## API Endpoints

### Health Check
- `GET /healthz` - Returns system status

### Links API
- `POST /api/links` - Create a new link
  - Body: `{ "target_url": "https://example.com", "code": "optional" }`
  - Returns 409 if code already exists
  
- `GET /api/links` - List all links

- `GET /api/links/:code` - Get stats for a specific code

- `DELETE /api/links/:code` - Delete a link

### Redirect
- `GET /:code` - Redirects to target URL (302) and increments click count

## Deployment

### Backend on Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `backend/`
3. Add environment variables in Vercel dashboard
4. Deploy

### Frontend on Vercel

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend/`
3. Add `REACT_APP_API_URL` environment variable
4. Deploy

### Database on Railway

1. Create a new PostgreSQL database on Railway
2. Copy the connection string
3. Add it as `DATABASE_URL` in your backend environment variables

## Testing

The application follows the specified URL conventions for automated testing:

- `/` - Dashboard
- `/code/:code` - Stats page
- `/:code` - Redirect (302 or 404)
- `/healthz` - Health check (200)

## Code Validation

- Custom codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- URLs must include protocol (http:// or https://)
- Duplicate codes return 409 status
- Deleted links return 404

