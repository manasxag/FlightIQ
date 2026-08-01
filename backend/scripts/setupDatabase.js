import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, isDatabaseConfigured, closeDatabase } from '../config/database.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const databaseDirectory = join(currentDirectory, '..', '..', 'database');

if (!isDatabaseConfigured()) {
  console.error('DATABASE_URL is required. Copy backend/.env.example to backend/.env and update it.');
  process.exitCode = 1;
} else {
  const pool = getPool();
  try {
    const schema = await readFile(join(databaseDirectory, 'schema.sql'), 'utf8');
    const seed = await readFile(join(databaseDirectory, 'seed.sql'), 'utf8');
    const metrics = JSON.parse(await readFile(join(currentDirectory, '..', 'python', 'artifacts', 'metrics.json'), 'utf8'));
    await pool.query(schema);
    await pool.query(seed);
    await pool.query('UPDATE model_versions SET is_active = FALSE WHERE is_active = TRUE');
    await pool.query(`
      INSERT INTO model_versions (version, algorithm, trained_at, training_rows, metrics, feature_importance, is_active)
      VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,TRUE)
      ON CONFLICT (version) DO UPDATE SET metrics = EXCLUDED.metrics,
        feature_importance = EXCLUDED.feature_importance, is_active = TRUE
    `, [metrics.version, metrics.algorithm, metrics.trainedAt, metrics.trainingRows,
      JSON.stringify(metrics), JSON.stringify(metrics.featureImportance)]);
    console.log('FlightIQ database schema and demo seed installed successfully.');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}
