import { getDashboard } from '../services/dashboardService.js';
import { getFlights } from '../services/flightService.js';
import { getAirlines, getAirports, getRoutes, getAnalytics } from '../services/analyticsService.js';
import { predictDelay } from '../services/predictionService.js';
import { getModelInsights, recordPrediction } from '../services/modelService.js';
import { parseFlightFilters, validatePredictionInput } from '../utils/validation.js';
import { sendSuccess } from '../utils/responses.js';

export const dashboard = async (_request, response) => sendSuccess(response, await getDashboard());

export const flights = async (request, response) => {
  const filters = parseFlightFilters(request.query);
  const result = await getFlights(filters);
  sendSuccess(response, result.items, { page: filters.page, limit: filters.limit, total: result.total, source: result.source });
};

export const airlines = async (_request, response) => {
  const result = await getAirlines();
  sendSuccess(response, result.items, { total: result.items.length, source: result.source });
};

export const airports = async (_request, response) => {
  const result = await getAirports();
  sendSuccess(response, result.items, { total: result.items.length, source: result.source });
};

export const routes = async (_request, response) => {
  const result = await getRoutes();
  sendSuccess(response, result.items, { total: result.items.length, source: result.source });
};

export const analytics = async (request, response) => sendSuccess(response, await getAnalytics(request.query.type));

export const modelInsights = async (_request, response) => sendSuccess(response, await getModelInsights());

export const predict = async (request, response) => {
  const input = validatePredictionInput(request.body);
  const result = await predictDelay(input);
  await recordPrediction(input, result, request.id);
  sendSuccess(response, result);
};
