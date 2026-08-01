import app from './app.js';
import { env } from './config/env.js';
import { closeDatabase } from './config/database.js';

const server = app.listen(env.port, () => {
  console.log(`FlightIQ API listening on http://localhost:${env.port}`);
  console.log(`Data mode: ${env.databaseUrl ? 'PostgreSQL' : 'demo fallback'}`);
});

server.requestTimeout = 15_000;
server.headersTimeout = 16_000;
server.keepAliveTimeout = 5_000;
server.on('error', (error) => {
  console.error('FlightIQ server error:', error.message);
  process.exitCode = 1;
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
