import { initDb } from './db/index.js';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initialize = async () => {
  let retries = 5;
  while (retries) {
    try {
      console.log('Initializing database...');
      await initDb();
      console.log('Database initialization complete.');
      return;
    } catch (err) {
      console.error('Failed to initialize database, retrying...', err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      // wait 5 seconds before retrying
      await wait(5000);
    }
  }

  console.error('Could not initialize database after multiple retries, exiting.');
  process.exit(1);
};

initialize().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
