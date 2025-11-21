import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Parse DATABASE_URL or use individual connection parameters
function createConnection() {
  if (process.env.DATABASE_URL) {
    // Parse MySQL connection string: mysql://user:password@host:port/database
    const url = new URL(process.env.DATABASE_URL);
    return mysql.createPool({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  } else {
    // Use individual environment variables
    return mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tinylink',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

const pool = createConnection();

async function initDatabase() {
  try {
    // First, ensure database exists (if using individual variables)
    if (!process.env.DATABASE_URL && process.env.DB_NAME) {
      try {
        // Try to create database if it doesn't exist
        const tempPool = mysql.createPool({
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        
        await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await tempPool.end();
        console.log(`Database '${process.env.DB_NAME}' ensured`);
      } catch (dbError) {
        // If we can't create the database, it might already exist or we don't have permissions
        // Continue anyway - the connection will fail later if there's a real issue
        console.log('Note: Could not auto-create database (may already exist or need manual creation)');
      }
    }

    const schemaPath = path.join(__dirname, 'schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove comment lines (lines starting with --)
    schema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    // Split schema into individual statements (MySQL requires executing statements separately)
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} schema statements...`);
    if (statements.length === 0) {
      console.error('Schema file contents:', schema);
      throw new Error('No SQL statements found in schema.sql');
    }
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          await pool.execute(statement);
          console.log(`✓ Statement ${i + 1} executed successfully`);
        } catch (stmtError) {
          // If table already exists, that's okay (CREATE TABLE IF NOT EXISTS should prevent this, but just in case)
          if (stmtError.code === 'ER_DUP_TABLE' || stmtError.errno === 1050) {
            console.log(`⚠ Statement ${i + 1} skipped (table already exists): ${stmtError.message}`);
          } else {
            console.error(`✗ Error executing statement ${i + 1}:`, stmtError.message);
            console.error(`  Error code: ${stmtError.code}, errno: ${stmtError.errno}`);
            console.error(`  SQL: ${statement.substring(0, 100)}...`);
            throw stmtError;
          }
        }
      }
    }
    
    // Verify table was created
    try {
      const [tables] = await pool.execute("SHOW TABLES LIKE 'links'");
      if (tables.length === 0) {
        throw new Error('Table "links" was not created successfully');
      }
      console.log('✓ Verified: links table exists');
    } catch (verifyError) {
      console.error('✗ Verification failed:', verifyError.message);
      throw verifyError;
    }
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    // Don't throw in production to allow serverless functions to start
    console.error('Error initializing database:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
    return false;
  }
}

// Don't auto-initialize on import - let server.js control when to initialize
// This prevents issues with serverless environments
export { pool, initDatabase };

