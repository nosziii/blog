import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;
const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        tags TEXT[] NOT NULL,
        read_time INTEGER NOT NULL,
        published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const hash = await bcrypt.hash('JDnn26hg', saltRounds);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['mzsolt', hash]
    );
  } catch (err) {
    console.error('Error initializing database', err);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'codewars-blog-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({
          success: true,
          message: 'Login successful',
          user: { id: user.id, username: user.username }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({
      authenticated: true,
      user: { id: req.session.userId, username: req.session.username }
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
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

app.post('/api/posts', authMiddleware, async (req, res) => {
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

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.session.username
  });
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
