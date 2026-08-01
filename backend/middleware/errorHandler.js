import { env } from '../config/env.js';

export function errorHandler(error, request, response, _next) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error(`[${request.id}]`, error);
  response.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? 'An unexpected server error occurred' : error.message,
      ...(error.details ? { details: error.details } : {}),
      requestId: request.id,
      ...(env.nodeEnv === 'development' && statusCode === 500 ? { debug: error.message } : {}),
    },
  });
}
