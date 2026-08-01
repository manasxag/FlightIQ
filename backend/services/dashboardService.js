import { isDatabaseConfigured } from '../config/database.js';
import { getDashboardAnalytics, getDashboardSummary } from '../models/analyticsModel.js';
import { dashboard } from '../data/demoData.js';

export async function getDashboard() {
  if (!isDatabaseConfigured()) return { ...dashboard, source: 'demo' };
  const [totals, analytics] = await Promise.all([getDashboardSummary(), getDashboardAnalytics()]);
  return { totals, ...analytics, source: 'database' };
}
