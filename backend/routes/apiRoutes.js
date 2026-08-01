import { Router } from 'express';
import * as apiController from '../controllers/apiController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/dashboard', asyncHandler(apiController.dashboard));
router.get('/flights', asyncHandler(apiController.flights));
router.get('/airlines', asyncHandler(apiController.airlines));
router.get('/airports', asyncHandler(apiController.airports));
router.get('/routes', asyncHandler(apiController.routes));
router.get('/analytics', asyncHandler(apiController.analytics));
router.get('/model-insights', asyncHandler(apiController.modelInsights));
router.post('/predict', asyncHandler(apiController.predict));

export default router;
