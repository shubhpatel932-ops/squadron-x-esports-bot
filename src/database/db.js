import pg from 'pg';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

const { Pool } = pg;

let pool;

/**
 * Initialize database connection pool
 */
export async function initializeDatabase() {
  try {
    pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('✅ Database connected successfully');
    return pool;
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

/**
 * Get database pool
 */
export function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

/**
 * Execute a query
 */
export async function query(text, params) {
  try {
    const result = await getPool().query(text, params);
    return result;
  } catch (error) {
    logger.error('Database query error:', { text, params, error });
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (pool) {
    await pool.end();
    logger.info('Database connection closed');
  }
}

export default { initializeDatabase, getPool, query, closeDatabase };
