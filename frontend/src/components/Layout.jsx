import { useState } from 'react';
import {
  Activity, BarChart3, BrainCircuit, Building2, Menu, Plane,
  Radar, Route, Search, Sparkles, X,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: BarChart3 },
  { id: 'search', label: 'Flights', icon: Search },
  { id: 'predict', label: 'Predict', icon: Sparkles },
  { id: 'airlines', label: 'Airlines', icon: Plane },
  { id: 'airports', label: 'Airports', icon: Building2 },
  { id: 'routes', label: 'Routes', icon: Route },
  { id: 'model', label: 'Model', icon: BrainCircuit },
];

const titles = {
  dashboard: ['Network overview', 'Domestic operations · Rolling 12 months'],
  search: ['Flight search', 'Historical service records'],
  predict: ['Delay forecast', 'Machine-learning risk estimate'],
  airlines: ['Airline performance', 'Carrier benchmarks'],
  airports: ['Airport performance', 'Traffic and congestion'],
  routes: ['Route performance', 'City-pair reliability'],
  model: ['Model insights', 'Random Forest · Version 1.2'],
};

export default function Layout({ page, setPage, children }) {
  const [open, setOpen] = useState(false);
  const [title, subtitle] = titles[page];
  const navigate = (id) => {
    setPage(id);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="travel-shell">
      <div className="backdrop-shade" />
      <header className="travel-nav glass-surface">
        <button className="travel-brand" onClick={() => navigate('dashboard')} aria-label="FlightIQ home">
          <span><Radar size={20} /></span><strong>FlightIQ</strong>
        </button>

        <nav className={open ? 'is-open' : ''} aria-label="Primary navigation">
          <div className="mobile-nav-head"><strong>Navigate</strong><button onClick={() => setOpen(false)} aria-label="Close navigation"><X size={19}/></button></div>
          {navItems.map((item) => (
            <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>
              <item.icon size={15}/><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-status"><i/><span>Data current</span></div>
        <button className="mobile-nav-toggle" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
      </header>

      {open && <button className="nav-scrim" onClick={() => setOpen(false)} aria-label="Close navigation"/>}

      <main className="travel-main">
        <section className="context-bar glass-surface">
          <div><span className="context-kicker">FLIGHT INTELLIGENCE</span><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="context-actions">
            <span className="context-date">29 JUL 2026</span>
            {page !== 'predict' && <button onClick={() => navigate('predict')}><Sparkles size={15}/>New forecast</button>}
            {page === 'predict' && <span className="model-online"><Activity size={14}/>Model online</span>}
          </div>
        </section>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
