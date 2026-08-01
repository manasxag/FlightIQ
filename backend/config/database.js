import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;
let pool;

export const isDatabaseConfigured = () => Boolean(env.databaseUrl);

export const getPool = () => {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: env.dbSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on('error', (error) => console.error('Unexpected PostgreSQL pool error:', error.message));
  }
  return pool;
};

export const query = async (text, params = []) => {
  const activePool = getPool();
  if (!activePool) throw new Error('PostgreSQL is not configured');
  return activePool.query(text, params);
};

export const checkDatabase = async () => {
  if (!isDatabaseConfigured()) return { configured: false, connected: false };
  try {
    await query('SELECT 1');
    return { configured: true, connected: true };
  } catch (error) {
    return { configured: true, connected: false, error: error.message };
  }
};

export const closeDatabase = async () => {
  if (pool) await pool.end();
  pool = undefined;
};
