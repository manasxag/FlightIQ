import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Filter, PlaneTakeoff, Search, X } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { airlines, airports, flights } from '../data/mockData';
import { fetchFlights } from '../services/api';

export default function FlightSearch() {
  const [filters, setFilters] = useState({ query: '', origin: '', destination: '', airline: '', date: '' });
  const [records, setRecords] = useState(flights);
  const [loading, setLoading] = useState(false);
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clear = () => setFilters({ query: '', origin: '', destination: '', airline: '', date: '' });
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      fetchFlights({ number: filters.query, origin: filters.origin, destination: filters.destination, airline: filters.airline, date: filters.date, limit: 100 })
        .then((payload) => { if (active) setRecords(payload.data.map((flight) => ({ ...flight, delay: flight.delayMinutes }))); })
        .catch(() => { if (active) setRecords(flights); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [filters]);
  const results = useMemo(() => records.filter((flight) => {
    const q = filters.query.toLowerCase();
    return (!q || flight.number.toLowerCase().includes(q)) && (!filters.origin || flight.origin === filters.origin) && (!filters.destination || flight.destination === filters.destination) && (!filters.airline || flight.airline === filters.airline) && (!filters.date || flight.date === filters.date);
  }), [filters, records]);

  return (
    <>
      <section className="search-hero panel">
        <div><p className="eyebrow"><PlaneTakeoff size={14} /> Flight record lookup</p><h2>Search operations history</h2><p>Query completed flights by service number, route, carrier, or date.</p></div>
        <Search size={76} strokeWidth={0.8} />
      </section>
      <section className="panel filter-panel">
        <div className="filter-heading"><span><Filter size={17} /> Search filters</span>{Object.values(filters).some(Boolean) && <button className="text-button" onClick={clear}><X size={14} />Clear all</button>}</div>
        <div className="filters-grid">
          <label className="field search-field"><span>Flight number</span><div><Search size={17} /><input value={filters.query} onChange={(e) => update('query', e.target.value)} placeholder="e.g. 6E 2112" /></div></label>
          <label className="field"><span>Origin</span><select value={filters.origin} onChange={(e) => update('origin', e.target.value)}><option value="">All origins</option>{airports.map((a) => <option key={a.code}>{a.code}</option>)}</select></label>
          <label className="field"><span>Destination</span><select value={filters.destination} onChange={(e) => update('destination', e.target.value)}><option value="">All destinations</option>{airports.map((a) => <option key={a.code}>{a.code}</option>)}</select></label>
          <label className="field"><span>Airline</span><select value={filters.airline} onChange={(e) => update('airline', e.target.value)}><option value="">All airlines</option>{airlines.map((a) => <option key={a.code}>{a.name}</option>)}</select></label>
          <label className="field"><span>Date</span><div className="date-input"><CalendarDays size={17} /><input type="date" value={filters.date} onChange={(e) => update('date', e.target.value)} /></div></label>
        </div>
      </section>
      <section className="panel table-panel">
        <div className="panel-heading"><div><h2>Flight results</h2><p>{loading ? 'Searching operations data…' : `${results.length} flights match your filters`}</p></div></div>
        {results.length ? <div className="table-scroll"><table><thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Delay</th><th>Status</th></tr></thead><tbody>{results.map((f) => <tr key={f.number + f.date}><td><strong>{f.number}</strong><small>{f.airline} · {f.date}</small></td><td><div className="route-cell"><b>{f.origin}</b><ArrowRight size={14} /><b>{f.destination}</b></div></td><td><strong>{f.actualDeparture}</strong><small>Scheduled {f.scheduledDeparture}</small></td><td><strong>{f.actualArrival}</strong><small>Scheduled {f.scheduledArrival}</small></td><td className={f.delay > 0 ? 'delay-text' : 'ontime-text'}>{f.delay ? `+${f.delay} min` : '—'}</td><td><StatusBadge status={f.status} /></td></tr>)}</tbody></table></div> : <div className="empty-state"><Search size={30} /><h3>No flights found</h3><p>Try removing a filter or searching a different flight number.</p><button className="secondary-button" onClick={clear}>Reset filters</button></div>}
      </section>
    </>
  );
}
