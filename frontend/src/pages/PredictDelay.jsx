import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, CloudRain, LoaderCircle, Plane, Sparkles, WandSparkles } from 'lucide-react';
import { airlines, airports } from '../data/mockData';
import { requestPrediction } from '../services/api';

const initial = { airline: '', origin: '', destination: '', departureHour: '', month: '', dayOfWeek: '', distance: '', weather: 'Clear' };

export default function PredictDelay() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => { setForm((f) => ({ ...f, [key]: value })); setResult(null); setError(''); };

  const submit = async (event) => {
    event.preventDefault();
    if (form.origin === form.destination) return setError('Origin and destination must be different.');
    setLoading(true); setError('');
    try { setResult(await requestPrediction({ ...form, departureHour: Number(form.departureHour), month: Number(form.month), distance: Number(form.distance) })); }
    catch { setError('Prediction is temporarily unavailable. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="predict-layout">
      <section className="panel predictor-panel">
        <div className="predictor-heading"><div className="spark-icon"><WandSparkles size={24} /></div><div><h2>Plan with confidence</h2><p>Enter flight conditions to estimate the chance and likely length of a departure delay.</p></div></div>
        <form onSubmit={submit}>
          <div className="form-section"><h3><span>01</span> Flight details</h3><div className="form-grid">
            <label className="field"><span>Airline</span><select required value={form.airline} onChange={(e) => update('airline', e.target.value)}><option value="">Select airline</option>{airlines.map((a) => <option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}</select></label>
            <label className="field"><span>Distance (km)</span><input required min="100" max="10000" type="number" value={form.distance} onChange={(e) => update('distance', e.target.value)} placeholder="e.g. 1148" /></label>
            <label className="field"><span>Origin</span><select required value={form.origin} onChange={(e) => update('origin', e.target.value)}><option value="">Select origin</option>{airports.map((a) => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}</select></label>
            <label className="field"><span>Destination</span><select required value={form.destination} onChange={(e) => update('destination', e.target.value)}><option value="">Select destination</option>{airports.map((a) => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}</select></label>
          </div></div>
          <div className="form-section"><h3><span>02</span> Schedule & conditions</h3><div className="form-grid three">
            <label className="field"><span>Departure hour</span><select required value={form.departureHour} onChange={(e) => update('departureHour', e.target.value)}><option value="">Select hour</option>{Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>)}</select></label>
            <label className="field"><span>Month</span><select required value={form.month} onChange={(e) => update('month', e.target.value)}><option value="">Select month</option>{['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => <option value={i + 1} key={m}>{m}</option>)}</select></label>
            <label className="field"><span>Day of week</span><select required value={form.dayOfWeek} onChange={(e) => update('dayOfWeek', e.target.value)}><option value="">Select day</option>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => <option key={d}>{d}</option>)}</select></label>
            <label className="field"><span>Weather</span><select value={form.weather} onChange={(e) => update('weather', e.target.value)}>{['Clear','Cloudy','Rain','Fog','Storm'].map((w) => <option key={w}>{w}</option>)}</select></label>
          </div></div>
          {error && <div className="form-error"><AlertTriangle size={16} />{error}</div>}
          <button className="primary-button predict-button" disabled={loading}>{loading ? <><LoaderCircle className="spinner" size={18} />Analyzing flight</> : <><Sparkles size={18} />Predict delay<ArrowRight size={17} /></>}</button>
        </form>
      </section>

      <aside className="prediction-side">
        {result ? <section className="panel result-card">
          <p className="eyebrow"><Sparkles size={13} /> Prediction ready</p>
          <div className={`result-icon ${result.probability >= 50 ? 'warning' : 'safe'}`}>{result.probability >= 50 ? <AlertTriangle size={27} /> : <CheckCircle2 size={27} />}</div>
          <h2>{result.prediction}</h2><p>Based on the flight details and known operating patterns.</p>
          <div className="probability-ring" style={{ '--probability': `${result.probability * 3.6}deg` }}><div><strong>{result.probability}%</strong><span>delay risk</span></div></div>
          <div className="expected-delay"><span>Expected delay</span><strong>{result.expectedDelayMinutes} min</strong></div>
          {result.demo && <small className="demo-note">Preview estimate · ML service connects in the backend phase</small>}
        </section> : <section className="panel result-placeholder"><div className="radar-visual"><i /><i /><Plane size={30} /></div><h3>Your forecast appears here</h3><p>Complete the flight details and FlightIQ will assess the delay risk.</p><div className="signal-list"><span><CloudRain size={15} /> Weather conditions</span><span><Plane size={15} /> Route history</span><span><Sparkles size={15} /> 7 engineered features</span></div></section>}
        <section className="info-note"><strong>How accurate is it?</strong><p>The trained demonstration model scores 84.9% accuracy with a 5.22-minute delay-estimation error on held-out records.</p></section>
      </aside>
    </div>
  );
}
