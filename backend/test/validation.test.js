import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFlightFilters, validatePredictionInput } from '../utils/validation.js';

const validPrediction = {
  airline: '6E', origin: 'DEL', destination: 'BOM', departureHour: 18,
  month: 7, dayOfWeek: 'Wednesday', distance: 1148, weather: 'Rain',
};

test('prediction validation normalizes valid input', () => {
  const result = validatePredictionInput({ ...validPrediction, origin: 'del' });
  assert.equal(result.origin, 'DEL');
  assert.equal(result.departureHour, 18);
});

test('prediction validation rejects identical airports', () => {
  assert.throws(
    () => validatePredictionInput({ ...validPrediction, destination: 'DEL' }),
    (error) => error.statusCode === 400 && error.details.includes('origin and destination must be different'),
  );
});

test('flight pagination is bounded', () => {
  assert.deepEqual(parseFlightFilters({ page: '-4', limit: '999' }), {
    number: undefined, origin: undefined, destination: undefined, airline: undefined,
    date: undefined, page: 1, limit: 100,
  });
});
