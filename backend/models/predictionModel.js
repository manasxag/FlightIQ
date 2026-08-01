import { query } from '../config/database.js';

export async function insertPredictionLog(input, result, requestId) {
  await query(`
    INSERT INTO prediction_logs (
      airline_code, origin_code, destination_code, departure_hour, month, day_of_week,
      distance_km, weather, prediction, probability, expected_delay_minutes,
      model_version, used_fallback, request_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
  `, [
    input.airline, input.origin, input.destination, input.departureHour, input.month,
    input.dayOfWeek, Math.round(input.distance), input.weather, result.prediction,
    result.probability, result.expectedDelayMinutes, result.modelVersion,
    Boolean(result.fallback), requestId,
  ]);
}
