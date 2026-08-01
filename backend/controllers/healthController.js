import { checkDatabase } from '../config/database.js';
import { sendSuccess } from '../utils/responses.js';

export const health = async (_request, response) => {
  const database = await checkDatabase();
  sendSuccess(response, {
    status: database.configured && !database.connected ? 'degraded' : 'ok',
    service: 'flightiq-api',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database,
  });
};
