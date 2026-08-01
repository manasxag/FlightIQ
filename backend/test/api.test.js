import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}/api`;
      resolve();
    });
  });
});

after(async () => new Promise((resolve) => server.close(resolve)));

test('health endpoint exposes service and database state', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.service, 'flightiq-api');
  assert.equal(payload.data.database.configured, false);
});

test('dashboard endpoint returns the documented response envelope', async () => {
  const response = await fetch(`${baseUrl}/dashboard`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.source, 'demo');
  assert.ok(payload.data.totals.flights > 0);
});

test('unknown endpoints include a traceable request ID', async () => {
  const response = await fetch(`${baseUrl}/missing`);
  const payload = await response.json();
  assert.equal(response.status, 404);
  assert.equal(payload.success, false);
  assert.ok(payload.error.requestId);
});
