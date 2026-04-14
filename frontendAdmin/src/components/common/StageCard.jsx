import { estimateTime } from '../../utils/formatters';
import './StageCard.css';

export default function StageCard({ stage, onReadMore }) {
  return (
    <div className={`stage-card ${stage.current ? 'current' : ''}`}>
      <div className="stage-image">
        <span className="stage-number">ETAPA {stage.number}</span>
        {stage.current && <span className="stage-current-badge">EN CURSO</span>}
      </div>
      <div className="stage-content">
        <h3 className="stage-title">{stage.title}</h3>
        <div className="stage-stats">
          <span className="stage-stat">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {stage.distance} km
          </span>
          <span className="stage-stat">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {stage.elevation} m
          </span>
        </div>
        <p className="stage-summary">{stage.summary}</p>
        <span className="stage-date">{stage.date}</span>
      </div>
    </div>
  );
}