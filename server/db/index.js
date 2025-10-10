import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;
const saltRounds = 10;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS series (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
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
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        series_id INTEGER REFERENCES series(id) ON DELETE SET NULL,
        order_in_series INTEGER
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_approved BOOLEAN NOT NULL DEFAULT false
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Insert default categories if they don't exist
    const defaultCategories = ['announcement', 'tutorials', 'programming', 'design', 'technology'];
    for (const category of defaultCategories) {
      await pool.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [category]);
    }

    // Insert default settings if they don't exist
    const defaultSettings = {
      'blog_title': 'My Awesome Blog',
      'footer_text': '&copy; 2024 My Awesome Blog. All rights reserved.'
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value]);
    }

    const hash = await bcrypt.hash('JDnn26hg', saltRounds);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['mzsolt', hash]
    );
  } catch (err) {
    console.error('Error initializing database', err);
  }
};

export default pool;
