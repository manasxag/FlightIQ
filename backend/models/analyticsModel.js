import { query } from '../config/database.js';

export async function findAirlines() {
  const result = await query(`
    SELECT a.id, a.code, a.name, ROUND(AVG(f.delay_minutes), 1)::float AS "averageDelay",
      ROUND(100.0 * COUNT(*) FILTER (WHERE f.delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "onTimePercentage",
      ROUND(100.0 * COUNT(*) FILTER (WHERE f.status = 'Cancelled') / NULLIF(COUNT(*), 0), 2)::float AS "cancellationRate"
    FROM airlines a LEFT JOIN flights f ON f.airline_id = a.id GROUP BY a.id ORDER BY "onTimePercentage" DESC NULLS LAST
  `);
  return result.rows;
}

export async function findAirports() {
  const result = await query(`
    SELECT ap.id, ap.code, ap.name, ap.city, COUNT(f.id)::int AS "flightCount",
      ROUND(AVG(f.delay_minutes), 1)::float AS "averageDelay"
    FROM airports ap LEFT JOIN routes r ON ap.id IN (r.origin_airport_id, r.destination_airport_id)
    LEFT JOIN flights f ON f.route_id = r.id GROUP BY ap.id ORDER BY "flightCount" DESC
  `);
  return result.rows;
}

export async function findRoutes() {
  const result = await query(`
    SELECT r.id, origin.code AS origin, destination.code AS destination, COUNT(f.id)::int AS "flightCount",
      ROUND(AVG(f.delay_minutes), 1)::float AS "averageDelay",
      ROUND(100.0 * COUNT(*) FILTER (WHERE f.delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "reliabilityScore",
      r.distance_km AS distance
    FROM routes r JOIN airports origin ON origin.id = r.origin_airport_id
    JOIN airports destination ON destination.id = r.destination_airport_id
    LEFT JOIN flights f ON f.route_id = r.id GROUP BY r.id, origin.code, destination.code ORDER BY "flightCount" DESC
  `);
  return result.rows;
}

export async function getDashboardSummary() {
  const result = await query(`
    SELECT COUNT(*)::int AS flights, ROUND(AVG(delay_minutes), 1)::float AS "averageDelay",
      ROUND(100.0 * COUNT(*) FILTER (WHERE delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "onTimePercentage",
      COUNT(DISTINCT airline_id)::int AS airlines,
      (SELECT COUNT(*)::int FROM airports) AS airports
    FROM flights
  `);
  return result.rows[0];
}

export async function getDashboardAnalytics() {
  const [trend, distribution, airlineDelay, delayedRoutes, hourly] = await Promise.all([
    query(`
      SELECT TO_CHAR(DATE_TRUNC('month', flight_date), 'Mon') AS month,
        ROUND(AVG(delay_minutes), 1)::float AS "averageDelay",
        ROUND(100.0 * COUNT(*) FILTER (WHERE delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "onTimePercentage"
      FROM flights GROUP BY DATE_TRUNC('month', flight_date) ORDER BY DATE_TRUNC('month', flight_date)
    `),
    query(`
      SELECT CASE
        WHEN delay_minutes = 0 THEN 'On time' WHEN delay_minutes < 15 THEN '< 15m'
        WHEN delay_minutes < 30 THEN '15–30m' WHEN delay_minutes < 60 THEN '30–60m' ELSE '> 60m'
      END AS range, COUNT(*)::int AS flights
      FROM flights GROUP BY range
      ORDER BY MIN(delay_minutes)
    `),
    query(`
      SELECT a.code, a.name, ROUND(AVG(f.delay_minutes), 1)::float AS "averageDelay",
        ROUND(100.0 * COUNT(*) FILTER (WHERE f.delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "onTimePercentage"
      FROM flights f JOIN airlines a ON a.id = f.airline_id GROUP BY a.id ORDER BY "averageDelay"
    `),
    query(`
      SELECT origin.code AS origin, destination.code AS destination, COUNT(f.id)::int AS "flightCount",
        ROUND(AVG(f.delay_minutes), 1)::float AS "averageDelay",
        ROUND(100.0 * COUNT(*) FILTER (WHERE f.delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1)::float AS "reliabilityScore"
      FROM flights f JOIN routes r ON r.id = f.route_id
      JOIN airports origin ON origin.id = r.origin_airport_id
      JOIN airports destination ON destination.id = r.destination_airport_id
      GROUP BY origin.code, destination.code ORDER BY "averageDelay" DESC LIMIT 8
    `),
    query(`
      SELECT EXTRACT(HOUR FROM scheduled_departure)::int AS hour,
        ROUND(AVG(delay_minutes), 1)::float AS "averageDelay"
      FROM flights GROUP BY hour ORDER BY hour
    `),
  ]);
  return {
    monthlyTrend: trend.rows,
    delayDistribution: distribution.rows,
    delayByAirline: airlineDelay.rows,
    topDelayedRoutes: delayedRoutes.rows,
    peakDelayHours: hourly.rows,
  };
}
