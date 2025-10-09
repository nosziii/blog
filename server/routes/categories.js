import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Authentication required' });
  }
};

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new category
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name]
    );
    if (rows.length === 0) {
        return res.status(409).json({ error: 'Category already exists' });
    }
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a category
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // We should also consider what happens to posts that have this category.
    // For now, we just delete the category.
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
