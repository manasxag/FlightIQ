import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/apiRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { requestContext } from './middleware/requestContext.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = new Set([
  env.clientOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.disable('x-powered-by');
app.use(requestContext);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by FlightIQ CORS policy'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-Id'],
}));
app.use(express.json({ limit: '100kb' }));

app.use('/api/health', healthRoutes);
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
