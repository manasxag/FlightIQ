import test from 'node:test';
import assert from 'node:assert/strict';
import { getFlights } from '../services/flightService.js';
import { predictDelay } from '../services/predictionService.js';

test('flight service filters demo records by route', async () => {
  const result = await getFlights({ origin: 'DEL', destination: 'BOM', page: 1, limit: 25 });
  assert.equal(result.total, 2);
  assert.ok(result.items.every((flight) => flight.origin === 'DEL' && flight.destination === 'BOM'));
});

test('prediction bridge returns a bounded model result', async () => {
  const result = await predictDelay({
    airline: '6E', origin: 'DEL', destination: 'BOM', departureHour: 18,
    month: 7, dayOfWeek: 'Wednesday', distance: 1148, weather: 'Rain',
  });
  assert.equal(typeof result.fallback, 'boolean');
  assert.ok(result.probability >= 0 && result.probability <= 100);
  assert.ok(result.expectedDelayMinutes > 0);
});
