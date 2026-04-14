import './MetricCard.css';

export default function MetricCard({ value, label, icon }) {
  return (
    <div className="metric-card">
      {icon && (
        <div className="metric-card-icon">
          {icon}
        </div>
      )}
      <div className="metric-card-value">{value}</div>
      <div className="metric-card-label">{label}</div>
    </div>
  );
}
