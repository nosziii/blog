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
    const { rows } = await pool.query('SELECT * FROM series ORDER BY title');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { rows: seriesRows } = await pool.query('SELECT * FROM series WHERE slug = $1', [req.params.slug]);
    if (seriesRows.length === 0) {
      return res.status(404).json({ error: 'Series not found' });
    }
    const series = seriesRows[0];

    const { rows: postsRows } = await pool.query('SELECT * FROM posts WHERE series_id = $1 AND published = true ORDER BY order_in_series', [series.id]);
    series.posts = postsRows;

    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const { rows: seriesRows } = await pool.query('SELECT * FROM series WHERE id = $1', [req.params.id]);
    if (seriesRows.length === 0) {
      return res.status(404).json({ error: 'Series not found' });
    }
    const series = seriesRows[0];

    const { rows: postsRows } = await pool.query('SELECT * FROM posts WHERE series_id = $1 AND published = true ORDER BY order_in_series', [series.id]);
    series.posts = postsRows;

    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, slug } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO series (title, slug) VALUES ($1, $2) RETURNING *',
      [title, slug]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, slug } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE series SET title = $1, slug = $2 WHERE id = $3 RETURNING *',
      [title, slug, id]
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
    await pool.query('DELETE FROM series WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
