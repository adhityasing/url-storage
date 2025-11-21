import express from 'express';

const router = express.Router();

const startTime = Date.now();

// GET /healthz - Health check endpoint
router.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: uptime
  });
});

export default router;

