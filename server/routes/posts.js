import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE slug = $1', [req.params.slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, slug, content, excerpt, author, category, tags, read_time, published } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, slug, content, excerpt, author, category, tags, read_time, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, slug, content, excerpt, author, category, tags.split(','), read_time, published]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, excerpt, author, category, tags, read_time, published } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE posts SET title = $1, slug = $2, content = $3, excerpt = $4, author = $5, category = $6, tags = $7, read_time = $8, published = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
      [title, slug, content, excerpt, author, category, tags.split(','), read_time, published, id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
