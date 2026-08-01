import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

export default function ChartCard({ title, subtitle, children, wide = false, action }) {
  return (
    <section className={`panel chart-card ${wide ? 'wide' : ''}`}>
      <div className="panel-heading">
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {action ? <button className="text-button" onClick={action}>Explore <ArrowUpRight size={15} /></button> : <button className="icon-button muted" aria-label={`More options for ${title}`}><MoreHorizontal size={19} /></button>}
      </div>
      <div className="chart-wrap">{children}</div>
    </section>
  );
}
