import 'dotenv/config';

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5050,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  dbSsl: toBoolean(process.env.DB_SSL),
  pythonCommand: process.env.PYTHON_COMMAND || '',
  predictionTimeoutMs: Number(process.env.PREDICTION_TIMEOUT_MS) || 10_000,
  allowPredictionFallback: toBoolean(process.env.ALLOW_PREDICTION_FALLBACK, true),
});
