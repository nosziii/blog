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

// GET all approved comments for a post
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM comments WHERE post_id = $1 AND is_approved = true ORDER BY created_at DESC',
      [postId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new comment for a post
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: 'Author and content are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, author, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, author, content]
    );
    // We don't return the comment here to the user, 
    // as it needs to be approved first.
    res.status(201).json({ success: true, message: 'Comment submitted and awaiting approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Admin Routes ---

// GET all comments for admin
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT to approve/un-approve a comment
router.put('/admin/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { is_approved } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE comments SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved, commentId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a comment
router.delete('/admin/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
