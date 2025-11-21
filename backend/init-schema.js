import { initDatabase } from './db/init.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing database schema...\n');

initDatabase()
  .then(() => {
    console.log('\n✅ Schema initialization completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Schema initialization failed:');
    console.error(error);
    process.exit(1);
  });

