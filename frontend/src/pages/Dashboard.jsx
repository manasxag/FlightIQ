import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Clock3, Gauge, MapPin, Plane, Radio } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import MetricCard from '../components/MetricCard';
import { airlinePerformance, delayDistribution, monthlyTrend, peakHours, routePerformance } from '../data/mockData';
import { fetchDashboard } from '../services/api';

const tooltipStyle = { background: '#101d2d', border: '1px solid #25364b', borderRadius: 10, color: '#e7f0f8', fontSize: 12 };
const pieColors = ['#24c7d9', '#397af5', '#7b61ff', '#f5a63c', '#ef6270'];

export default function Dashboard({ navigate }) {
  const [range, setRange] = useState('12 months');
  const [data, setData] = useState({
    totals: { flights: 118420, averageDelay: 18.6, onTimePercentage: 81.7, airports: 64, airlines: 5 },
    monthlyTrend, delayDistribution, delayByAirline: airlinePerformance,
    topDelayedRoutes: routePerformance, peakDelayHours: peakHours,
  });
  useEffect(() => {
    let active = true;
    fetchDashboard().then((result) => {
      if (!active) return;
      setData({
        ...result,
        monthlyTrend: result.monthlyTrend.map((item) => ({ month: item.month, delay: item.averageDelay, onTime: item.onTimePercentage })),
        delayByAirline: result.delayByAirline.map((item) => ({ ...item, delay: item.averageDelay })),
        topDelayedRoutes: result.topDelayedRoutes.map((item) => ({ ...item, route: item.route || `${item.origin} → ${item.destination}`, flights: item.flights || item.flightCount, delay: item.delay || item.averageDelay, reliability: item.reliability || item.reliabilityScore })),
        peakDelayHours: result.peakDelayHours.map((item) => ({ hour: String(item.hour).padStart(2, '0'), delay: item.averageDelay })),
      });
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  return (
    <>
      <div className="page-intro">
        <div><p className="eyebrow"><Radio size={13} /> India domestic network</p><h2>Performance summary</h2><p>Reporting period: 01 Aug 2025 – 29 Jul 2026</p></div>
        <div className="range-switch" aria-label="Date range">
          {['30 days', '6 months', '12 months'].map((item) => <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Total flights" value={data.totals.flights.toLocaleString()} detail="vs last period" trend={8.4} icon={Plane} />
        <MetricCard label="Average delay" value={`${data.totals.averageDelay} min`} detail="vs last period" trend={-4.2} icon={Clock3} tone="violet" />
        <MetricCard label="On-time rate" value={`${data.totals.onTimePercentage}%`} detail="vs last period" trend={2.1} icon={Gauge} tone="green" />
        <MetricCard label="Active airports" value={data.totals.airports} detail={`across ${data.totals.airlines} airlines`} trend={3.2} icon={MapPin} tone="amber" />
      </div>

      <div className="chart-grid">
        <ChartCard title="Delay trend" subtitle={`Average delay and on-time performance · ${range}`} wide>
          <ResponsiveContainer width="100%" height={276}>
            <AreaChart data={data.monthlyTrend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs><linearGradient id="delayFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#24c7d9" stopOpacity={0.32}/><stop offset="95%" stopColor="#24c7d9" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="#1e2c3e" vertical={false} /><XAxis dataKey="month" stroke="#6f8198" axisLine={false} tickLine={false} /><YAxis stroke="#6f8198" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="delay" name="Avg delay (min)" stroke="#24c7d9" strokeWidth={2.5} fill="url(#delayFill)" activeDot={{ r: 5, fill: '#24c7d9' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Delay distribution" subtitle="Share of flights by arrival status">
          <div className="donut-layout">
            <ResponsiveContainer width="58%" height={245}>
              <PieChart><Pie data={data.delayDistribution} dataKey="flights" nameKey="range" innerRadius={65} outerRadius={90} paddingAngle={3} stroke="none">{data.delayDistribution.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">{data.delayDistribution.map((item, i) => <div key={item.range}><i style={{ background: pieColors[i] }} /><span>{item.range}</span><strong>{Math.round(item.flights / data.delayDistribution.reduce((sum, entry) => sum + entry.flights, 0) * 100)}%</strong></div>)}</div>
          </div>
        </ChartCard>

        <ChartCard title="Airline performance" subtitle="Average delay minutes by carrier" action={() => navigate('airlines')}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.delayByAirline} layout="vertical" margin={{ left: 8, right: 12 }}><CartesianGrid stroke="#1e2c3e" horizontal={false} /><XAxis type="number" stroke="#6f8198" axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={68} stroke="#8fa1b7" axisLine={false} tickLine={false} fontSize={11} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="delay" name="Delay (min)" fill="#7b61ff" radius={[0, 6, 6, 0]} barSize={14} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Peak delay hours" subtitle="Average delay by departure time">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.peakDelayHours} margin={{ left: -20, right: 6 }}><CartesianGrid stroke="#1e2c3e" vertical={false} /><XAxis dataKey="hour" stroke="#6f8198" axisLine={false} tickLine={false} /><YAxis stroke="#6f8198" axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="delay" name="Delay (min)" fill="#24c7d9" radius={[5, 5, 0, 0]} barSize={22} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Route reliability" subtitle="Most-travelled routes ranked by reliability" wide action={() => navigate('routes')}>
          <div className="route-list">
            {data.topDelayedRoutes.map((route, i) => <div className="route-row" key={route.route}><span className="rank">{String(i + 1).padStart(2, '0')}</span><strong>{route.route}</strong><span>{route.flights.toLocaleString()} flights</span><div className="reliability-bar"><i style={{ width: `${route.reliability}%` }} /></div><b>{route.reliability}%</b></div>)}
          </div>
        </ChartCard>
      </div>
    </>
  );
}
