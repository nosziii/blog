import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const searchQuery = `%${q}%`;
    const { rows } = await pool.query(
      `SELECT * FROM posts 
       WHERE published = true AND 
             (title ILIKE $1 OR 
              excerpt ILIKE $1 OR 
              content ILIKE $1 OR 
              $2 = ANY(tags))
       ORDER BY created_at DESC`,
      [searchQuery, q]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
