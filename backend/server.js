import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';
import healthRouter from './routes/health.js';
import { initDatabase } from './db/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database before starting server
let dbInitialized = false;
let initPromise = null;

const initializeApp = async () => {
  if (dbInitialized) return;
  
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initDatabase();
        dbInitialized = true;
        console.log('Database schema ready');
      } catch (error) {
        console.error('Database initialization error:', error);
        // In development, exit if database fails to initialize
        if (process.env.NODE_ENV !== 'production') {
          console.error('Exiting due to database initialization failure');
          process.exit(1);
        }
        throw error;
      }
    })();
  }
  
  return initPromise;
};

// Ensure database is initialized before handling requests
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeApp();
    } catch (error) {
      console.error('Database initialization failed on request:', error);
      // In development, return error; in production, allow retry
      if (process.env.NODE_ENV === 'development') {
        return res.status(503).json({ 
          error: 'Database not initialized', 
          message: error.message 
        });
      }
    }
  }
  next();
});

// Routes
app.use('/healthz', healthRouter);
app.use('/api/links', linksRouter);
app.use('/', redirectRouter); // Must be last to catch /:code routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel serverless
export default app;

// Start server only if not in serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  // Initialize database first, then start server
  initializeApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

