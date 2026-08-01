import { query } from '../config/database.js';

export async function findFlights(filters) {
  const conditions = [];
  const values = [];
  const addFilter = (sql, value) => { values.push(value); conditions.push(sql.replace('?', `$${values.length}`)); };

  if (filters.number) addFilter('f.flight_number ILIKE ?', `%${filters.number}%`);
  if (filters.origin) addFilter('origin.code = ?', filters.origin);
  if (filters.destination) addFilter('destination.code = ?', filters.destination);
  if (filters.airline) addFilter("CONCAT_WS(' ', a.code, a.name) ILIKE ?", `%${filters.airline}%`);
  if (filters.date) addFilter('f.flight_date = ?', filters.date);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(filters.limit, (filters.page - 1) * filters.limit);
  const result = await query(`
    SELECT f.id, f.flight_number AS number, a.name AS airline, a.code AS "airlineCode",
      origin.code AS origin, destination.code AS destination, f.flight_date AS date,
      f.scheduled_departure AS "scheduledDeparture", f.actual_departure AS "actualDeparture",
      f.scheduled_arrival AS "scheduledArrival", f.actual_arrival AS "actualArrival",
      f.delay_minutes AS "delayMinutes", f.status, r.distance_km AS distance,
      COUNT(*) OVER()::int AS "totalCount"
    FROM flights f
    JOIN airlines a ON a.id = f.airline_id
    JOIN routes r ON r.id = f.route_id
    JOIN airports origin ON origin.id = r.origin_airport_id
    JOIN airports destination ON destination.id = r.destination_airport_id
    ${where}
    ORDER BY f.flight_date DESC, f.scheduled_departure DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `, values);
  return result.rows;
}
