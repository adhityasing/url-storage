import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createEnvFile() {
  console.log('=== TinyLink Backend Environment Setup ===\n');
  console.log('This script will help you create a .env file with your MySQL credentials.\n');

  const dbHost = await question('MySQL Host [localhost]: ') || 'localhost';
  const dbPort = await question('MySQL Port [3306]: ') || '3306';
  const dbUser = await question('MySQL Username [root]: ') || 'root';
  const dbPassword = await question('MySQL Password: ');
  
  if (!dbPassword) {
    console.log('\n⚠️  Warning: No password provided. This might cause connection errors.');
    const continueWithoutPassword = await question('Continue anyway? (y/n): ');
    if (continueWithoutPassword.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  const dbName = await question('Database Name [tinylink]: ') || 'tinylink';
  const port = await question('Backend Port [3001]: ') || '3001';

  const envContent = `# Database Configuration (MySQL)
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# Server Configuration
PORT=${port}
NODE_ENV=development

# Base URL for short links
BASE_URL=http://localhost:${port}
`;

  const envPath = path.join(__dirname, '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('\n⚠️  .env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Existing .env file preserved.');
      rl.close();
      return;
    }
  }

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ .env file created successfully at: ${envPath}`);
    console.log('\nNext steps:');
    console.log('1. Verify your MySQL server is running');
    console.log('2. Start the backend: npm run dev');
    console.log('3. You should see "Database initialized successfully"');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
  }

  rl.close();
}

createEnvFile();

