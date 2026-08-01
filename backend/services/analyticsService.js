import { isDatabaseConfigured } from '../config/database.js';
import { findAirlines, findAirports, findRoutes } from '../models/analyticsModel.js';
import { airlines, airports, monthlyTrend, routes } from '../data/demoData.js';
import ApiError from '../utils/ApiError.js';

export async function getAirlines() {
  return { items: isDatabaseConfigured() ? await findAirlines() : airlines, source: isDatabaseConfigured() ? 'database' : 'demo' };
}

export async function getAirports() {
  return { items: isDatabaseConfigured() ? await findAirports() : airports, source: isDatabaseConfigured() ? 'database' : 'demo' };
}

export async function getRoutes() {
  return { items: isDatabaseConfigured() ? await findRoutes() : routes, source: isDatabaseConfigured() ? 'database' : 'demo' };
}

export async function getAnalytics(type = 'all') {
  const validTypes = ['all', 'airline', 'airport', 'route'];
  if (!validTypes.includes(type)) throw new ApiError(400, 'type must be one of: all, airline, airport, route');
  const response = {};
  if (type === 'all' || type === 'airline') response.airlines = (await getAirlines()).items;
  if (type === 'all' || type === 'airport') response.airports = (await getAirports()).items;
  if (type === 'all' || type === 'route') response.routes = (await getRoutes()).items;
  response.monthlyTrend = monthlyTrend;
  return response;
}
