import { initDb } from './db/index.js';

const initialize = async () => {
  console.log('Initializing database...');
  await initDb();
  console.log('Database initialization complete.');
};

initialize().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
