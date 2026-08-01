import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Building2, Clock3, Gauge, Plane, Route as RouteIcon, ShieldCheck } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import MetricCard from '../components/MetricCard';
import { airlinePerformance, airportPerformance, monthlyTrend, routePerformance } from '../data/mockData';
import { fetchAirlines, fetchAirports, fetchRoutes } from '../services/api';

const tooltipStyle = { background: '#101d2d', border: '1px solid #25364b', borderRadius: 10, color: '#e7f0f8', fontSize: 12 };

export function AirlineAnalytics() {
  const [data, setData] = useState(airlinePerformance);
  useEffect(() => { fetchAirlines().then((items) => setData(items.map((item) => ({ ...item, delay: item.averageDelay, onTime: item.onTimePercentage, cancellation: item.cancellationRate })))).catch(() => {}); }, []);
  const leader = [...data].sort((a, b) => b.onTime - a.onTime)[0] || data[0];
  const averageDelay = (data.reduce((sum, item) => sum + item.delay, 0) / data.length).toFixed(1);
  const averageOnTime = (data.reduce((sum, item) => sum + item.onTime, 0) / data.length).toFixed(1);
  const averageCancellation = (data.reduce((sum, item) => sum + item.cancellation, 0) / data.length).toFixed(2);
  return <><div className="analytics-banner"><div><span>BEST PERFORMER</span><h2>{leader.name} leads on reliability</h2><p>{leader.onTime}% of flights arrive on time across the demonstration network.</p></div><Plane size={80} /></div><div className="metrics-grid three"><MetricCard label="Average delay" value={`${averageDelay} min`} detail="network average" trend={-3.8} icon={Clock3} /><MetricCard label="On-time rate" value={`${averageOnTime}%`} detail="all carriers" trend={2.2} icon={Gauge} tone="green" /><MetricCard label="Cancellation rate" value={`${averageCancellation}%`} detail="all carriers" trend={-0.7} icon={ShieldCheck} tone="violet" /></div><div className="chart-grid"><ChartCard title="Carrier comparison" subtitle="Average delay minutes by airline"><ResponsiveContainer width="100%" height={290}><BarChart data={data}><CartesianGrid stroke="#1e2c3e" vertical={false}/><XAxis dataKey="name" stroke="#6f8198" axisLine={false} tickLine={false} fontSize={11}/><YAxis stroke="#6f8198" axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="delay" fill="#24c7d9" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Network delay trend" subtitle="Monthly average across all carriers"><ResponsiveContainer width="100%" height={290}><AreaChart data={monthlyTrend}><CartesianGrid stroke="#1e2c3e" vertical={false}/><XAxis dataKey="month" stroke="#6f8198" axisLine={false} tickLine={false}/><YAxis stroke="#6f8198" axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Area type="monotone" dataKey="delay" stroke="#7b61ff" fill="#7b61ff22" strokeWidth={2}/></AreaChart></ResponsiveContainer></ChartCard></div></>;
}

export function AirportAnalytics() {
  const [data, setData] = useState(airportPerformance);
  useEffect(() => { fetchAirports().then((items) => setData(items.map((item) => ({ ...item, flights: item.flightCount, delay: item.averageDelay, congestion: item.congestionScore || 50, peak: item.peakHours || '—' })))).catch(() => {}); }, []);
  return <><div className="analytics-banner airport"><div><span>NETWORK WATCH</span><h2>Evening congestion peaks at DEL</h2><p>Arrivals between 18:00 and 20:00 carry 1.6× the average delay risk.</p></div><Building2 size={80} /></div><section className="panel table-panel"><div className="panel-heading"><div><h2>Airport performance</h2><p>Traffic, congestion, and delay benchmarks</p></div></div><div className="table-scroll"><table><thead><tr><th>Airport</th><th>Annual flights</th><th>Avg delay</th><th>Peak window</th><th>Congestion score</th></tr></thead><tbody>{data.map((a) => <tr key={a.code}><td><strong>{a.code}</strong><small>{a.city}</small></td><td>{a.flights.toLocaleString()}</td><td className="delay-text">{a.delay} min</td><td>{a.peak}</td><td><div className="score-cell"><div><i style={{ width: `${a.congestion}%` }}/></div><b>{a.congestion}</b></div></td></tr>)}</tbody></table></div></section><ChartCard title="Traffic vs. delay" subtitle="Busiest airports and their average operational delay" wide><ResponsiveContainer width="100%" height={290}><BarChart data={data}><CartesianGrid stroke="#1e2c3e" vertical={false}/><XAxis dataKey="code" stroke="#6f8198" axisLine={false} tickLine={false}/><YAxis stroke="#6f8198" axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="delay" fill="#f5a63c" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></ChartCard></>;
}

export function RouteAnalytics() {
  const [data, setData] = useState(routePerformance);
  useEffect(() => { fetchRoutes().then((items) => setData(items.map((item) => ({ ...item, route: `${item.origin} → ${item.destination}`, flights: item.flightCount, delay: item.averageDelay, reliability: item.reliabilityScore })))).catch(() => {}); }, []);
  const best = [...data].sort((a, b) => b.reliability - a.reliability)[0] || data[0];
  return <><div className="analytics-banner route"><div><span>ROUTE INTELLIGENCE</span><h2>{best.route} is the safest bet</h2><p>A {best.reliability}% reliability score makes this the strongest high-volume route.</p></div><RouteIcon size={80} /></div><div className="route-cards">{data.map((r, i) => <article className="panel route-detail" key={r.route}><div><span>#{i + 1}</span><h3>{r.route}</h3><p>{r.flights.toLocaleString()} annual flights</p></div><div className="route-stat"><strong>{r.reliability}%</strong><span>Reliability</span></div><div className="route-stat"><strong>{r.delay} min</strong><span>Avg delay</span></div><div className="route-stat"><strong>{r.bestTimeToFly || (i < 2 ? '07:00' : '10:00')}</strong><span>Best time</span></div><div className="route-stat"><strong>{r.worstMonth || (i % 2 ? 'December' : 'July')}</strong><span>Worst month</span></div></article>)}</div></>;
}
