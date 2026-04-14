import './ProgressBar.css';

export default function ProgressBar({ current, total }) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-text">
        <span>{current.toLocaleString()} km financiados</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
    </div>
  );
}
