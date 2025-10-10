import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
};

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM settings');
    const settings = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const settings = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [value, key]);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
