export default function StatusBadge({ status }) {
  const tone = status.toLowerCase().replace(' ', '-');
  return <span className={`status-badge ${tone}`}><i />{status}</span>;
}
