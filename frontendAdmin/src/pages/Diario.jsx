import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStages } from '../hooks/useStages';
import { adaptStagesForCards } from '../services/adapters';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import { formatDate, estimateTime } from '../utils/formatters';
import './Diario.css';

export default function Diario() {
  const navigate = useNavigate();
  const { stages, loading } = useStages();
  const [expandedStage, setExpandedStage] = useState(null);

  const adaptedStages = adaptStagesForCards(stages);

  if (loading) return <Loading />;

  const toggleStage = (stageId) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const handleStageClick = (stageId) => {
    navigate(`/diario/${stageId}`);
  };

  return (
    <>
      <Navbar />
      <div className="diario-page">
        <div className="diario-hero">
          <div className="container">
            <h1>Diario del viaje</h1>
            <p>Documentamos cada pedalada de esta aventura</p>
          </div>
        </div>
        
        <div className="diario-content">
          {adaptedStages.length === 0 ? (
            <div className="timeline-empty">
              <p>Próximamente añadiremos las primeras etapas del viaje.</p>
            </div>
          ) : (
            <div className="timeline">
              {adaptedStages.map((stage) => (
                <div key={stage.id} className="timeline-item">
                  <div 
                    className={`timeline-dot ${stage.current ? 'current' : ''}`}
                    onClick={() => toggleStage(stage.id)}
                  />
                  <div className="timeline-content">
                    <span className={`timeline-number ${stage.current ? 'current' : ''}`}>
                      ETAPA {stage.number}
                      {stage.current && ' • EN CURSO'}
                    </span>
                    <h3 
                      className="timeline-title"
                      onClick={() => handleStageClick(stage.id)}
                    >
                      {stage.title}
                    </h3>
                    <div className="timeline-stats">
                      <span className="timeline-stat">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {stage.distance} km
                      </span>
                      <span className="timeline-stat">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {stage.elevation} m
                      </span>
                      <span className="timeline-stat">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {estimateTime(stage.distance)}
                      </span>
                    </div>
                    
                    {expandedStage === stage.id && stage.summary && (
                      <div className="timeline-detail">
                        <p>{stage.summary}</p>
                      </div>
                    )}
                    
                    <div className="timeline-actions">
                      <button 
                        className="timeline-view-btn"
                        onClick={() => handleStageClick(stage.id)}
                      >
                        Ver detalle
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <span className="timeline-date">{stage.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}