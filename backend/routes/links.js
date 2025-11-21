import express from 'express';
import { pool } from '../db/init.js';
import validator from 'validator';

const router = express.Router();

// Generate random code
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate code format
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// POST /api/links - Create a new link
router.post('/', async (req, res) => {
  try {
    // Check if pool is available
    if (!pool) {
      console.error('Database pool not initialized');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const { target_url, code: customCode } = req.body;

    // Validate target URL
    if (!target_url || !validator.isURL(target_url, { require_protocol: true })) {
      return res.status(400).json({ error: 'Invalid URL. Must include protocol (http:// or https://)' });
    }

    // Determine code to use
    let code;
    if (customCode) {
      // Validate custom code format
      if (!isValidCode(customCode)) {
        return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
      }
      code = customCode;
    } else {
      // Generate random code
      let attempts = 0;
      do {
        code = generateCode(6);
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({ error: 'Failed to generate unique code' });
        }
      } while (await codeExists(code));
    }

    // Check if code already exists
    if (await codeExists(code)) {
      return res.status(409).json({ error: 'Code already exists' });
    }

    // Insert new link
    await pool.execute(
      'INSERT INTO links (code, target_url) VALUES (?, ?)',
      [code, target_url]
    );

    // Fetch the created link
    const [rows] = await pool.execute(
      'SELECT * FROM links WHERE code = ?',
      [code]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating link:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) { // MySQL unique constraint violation
      return res.status(409).json({ error: 'Code already exists' });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/links - List all links
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT code, target_url, click_count, last_clicked_at, created_at FROM links ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links/:code - Get stats for a specific code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [rows] = await pool.execute(
      'SELECT code, target_url, click_count, last_clicked_at, created_at FROM links WHERE code = ?',
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/links/:code - Delete a link
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM links WHERE code = ?',
      [code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to check if code exists
async function codeExists(code) {
  try {
    const [rows] = await pool.execute('SELECT 1 FROM links WHERE code = ?', [code]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking if code exists:', error);
    throw error;
  }
}

export default router;

