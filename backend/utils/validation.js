import ApiError from './ApiError.js';

const airportCode = /^[A-Z]{3}$/;
const airlineCode = /^[A-Z0-9]{2,3}$/;
const allowedWeather = ['Clear', 'Cloudy', 'Rain', 'Fog', 'Storm'];
const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const requiredString = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) return `${field} is required`;
  return null;
};

export function validatePredictionInput(input = {}) {
  const errors = [
    requiredString(input.airline, 'airline'), requiredString(input.origin, 'origin'),
    requiredString(input.destination, 'destination'), requiredString(input.dayOfWeek, 'dayOfWeek'),
    requiredString(input.weather, 'weather'),
  ].filter(Boolean);

  if (input.airline && !airlineCode.test(input.airline.toUpperCase())) errors.push('airline must be a valid IATA code');
  if (input.origin && !airportCode.test(input.origin.toUpperCase())) errors.push('origin must be a three-letter IATA code');
  if (input.destination && !airportCode.test(input.destination.toUpperCase())) errors.push('destination must be a three-letter IATA code');
  if (input.origin?.toUpperCase() === input.destination?.toUpperCase()) errors.push('origin and destination must be different');
  if (!Number.isInteger(Number(input.departureHour)) || Number(input.departureHour) < 0 || Number(input.departureHour) > 23) errors.push('departureHour must be between 0 and 23');
  if (!Number.isInteger(Number(input.month)) || Number(input.month) < 1 || Number(input.month) > 12) errors.push('month must be between 1 and 12');
  if (!allowedDays.includes(input.dayOfWeek)) errors.push('dayOfWeek is invalid');
  if (!Number.isFinite(Number(input.distance)) || Number(input.distance) < 50 || Number(input.distance) > 20_000) errors.push('distance must be between 50 and 20000 kilometres');
  if (!allowedWeather.includes(input.weather)) errors.push('weather is invalid');

  if (errors.length) throw new ApiError(400, 'Prediction input is invalid', errors);
  return {
    airline: input.airline.toUpperCase(), origin: input.origin.toUpperCase(),
    destination: input.destination.toUpperCase(), departureHour: Number(input.departureHour),
    month: Number(input.month), dayOfWeek: input.dayOfWeek,
    distance: Number(input.distance), weather: input.weather,
  };
}

export function parseFlightFilters(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return {
    number: query.number?.trim(), origin: query.origin?.toUpperCase(),
    destination: query.destination?.toUpperCase(), airline: query.airline?.trim(),
    date: query.date, page, limit,
  };
}
