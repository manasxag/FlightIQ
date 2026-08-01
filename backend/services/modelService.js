import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDatabaseConfigured } from '../config/database.js';
import { insertPredictionLog } from '../models/predictionModel.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const metricsPath = join(currentDirectory, '..', 'python', 'artifacts', 'metrics.json');

export async function getModelInsights() {
  const content = await readFile(metricsPath, 'utf8');
  return JSON.parse(content);
}

export async function recordPrediction(input, result, requestId) {
  if (!isDatabaseConfigured()) return false;
  try {
    await insertPredictionLog(input, result, requestId);
    return true;
  } catch (error) {
    console.error('Unable to persist prediction log:', error.message);
    return false;
  }
}
