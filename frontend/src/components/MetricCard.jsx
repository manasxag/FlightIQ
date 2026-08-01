import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function MetricCard({ label, value, detail, trend, icon: Icon, tone = 'cyan' }) {
  const positive = trend >= 0;
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={20} /></div>
      <div className="metric-copy"><span>{label}</span><strong>{value}</strong></div>
      <div className={`metric-trend ${positive ? 'positive' : 'negative'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{Math.abs(trend)}%</span><small>{detail}</small>
      </div>
    </article>
  );
}
