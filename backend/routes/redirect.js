import express from 'express';
import { pool } from '../db/init.js';

const router = express.Router();

// GET /:code - Redirect to target URL
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [rows] = await pool.execute(
      'SELECT target_url FROM links WHERE code = ?',
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const targetUrl = rows[0].target_url;

    // Update click count and last clicked time
    await pool.execute(
      'UPDATE links SET click_count = click_count + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = ?',
      [code]
    );

    // Perform 302 redirect
    res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

