import { isDatabaseConfigured } from '../config/database.js';
import { findFlights } from '../models/flightModel.js';
import { flights } from '../data/demoData.js';

const normalize = (value) => value?.toLowerCase();

export async function getFlights(filters) {
  if (isDatabaseConfigured()) {
    const rows = await findFlights(filters);
    const total = rows[0]?.totalCount || 0;
    return { items: rows.map(({ totalCount: _totalCount, ...flight }) => flight), total, source: 'database' };
  }

  const filtered = flights.filter((flight) =>
    (!filters.number || normalize(flight.number).includes(normalize(filters.number))) &&
    (!filters.origin || flight.origin === filters.origin) &&
    (!filters.destination || flight.destination === filters.destination) &&
    (!filters.airline || normalize(`${flight.airlineCode} ${flight.airline}`).includes(normalize(filters.airline))) &&
    (!filters.date || flight.date === filters.date)
  );
  const offset = (filters.page - 1) * filters.limit;
  return { items: filtered.slice(offset, offset + filters.limit), total: filtered.length, source: 'demo' };
}
