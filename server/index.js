import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db/index.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import seriesRoutes from './routes/series.js';
import uploadRoutes from './routes/uploads.js';
import tagRoutes from './routes/tags.js';
import searchRoutes from './routes/search.js';
import commentRoutes from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initDb();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: 'codewars-blog-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }));

  app.use('/api', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/series', seriesRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/tags', tagRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/comments', commentRoutes);

  app.use(express.static(path.join(__dirname, '../public'))); // Serve public files
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
