import { lazy, Suspense, useEffect, useState } from 'react';
import Layout from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const FlightSearch = lazy(() => import('./pages/FlightSearch'));
const PredictDelay = lazy(() => import('./pages/PredictDelay'));
const ModelInsights = lazy(() => import('./pages/ModelInsights'));
const AirlineAnalytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.AirlineAnalytics })));
const AirportAnalytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.AirportAnalytics })));
const RouteAnalytics = lazy(() => import('./pages/Analytics').then((module) => ({ default: module.RouteAnalytics })));

const pages = ['dashboard', 'search', 'predict', 'airlines', 'airports', 'routes', 'model'];

export default function App() {
  const getPage = () => pages.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'dashboard';
  const [page, setPageState] = useState(getPage);
  useEffect(() => { const handler = () => setPageState(getPage()); window.addEventListener('hashchange', handler); return () => window.removeEventListener('hashchange', handler); }, []);
  const setPage = (next) => { window.location.hash = next; setPageState(next); };
  const content = { dashboard: <Dashboard navigate={setPage}/>, search: <FlightSearch/>, predict: <PredictDelay/>, airlines: <AirlineAnalytics/>, airports: <AirportAnalytics/>, routes: <RouteAnalytics/>, model: <ModelInsights/> }[page];
  return <Layout page={page} setPage={setPage}><Suspense fallback={<div className="panel page-loading" role="status"><span/><p>Loading flight intelligence…</p></div>}>{content}</Suspense></Layout>;
}
