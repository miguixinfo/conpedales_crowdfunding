import { useParams, useNavigate } from 'react-router-dom';
import { useStageById } from '../hooks/useStages';
import { useStats } from '../hooks/useStats';
import { formatStageTitle, formatDate, formatKm, formatMeters, estimateTime } from '../utils/formatters';
import { DONATION_CONFIG } from '../config/constants';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import './StageDetail.css';

export default function StageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stage, loading } = useStageById(id ? parseInt(id) : null);
  const { stats } = useStats();

  if (loading) return <Loading />;
  
  if (!stage) {
    return (
      <>
        <Navbar />
        <div className="stage-detail-page">
          <div className="container">
            <div className="stage-not-found">
              <h1>Etapa no encontrada</h1>
              <p>La etapa que buscas no existe o aún no ha sido publicada.</p>
              <Button href="/diario">Ver todas las etapas</Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const title = formatStageTitle(stage);
  const estimatedTime = estimateTime(stage.km);

  return (
    <>
      <Navbar />
      <div className="stage-detail-page">
        <div className="stage-hero">
          <div className="container">
            <button className="back-btn" onClick={() => navigate('/diario')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al diario
            </button>
            
            <div className="stage-header">
              <span className="stage-number">ETAPA {stage.dayNumber}</span>
              <h1>{title}</h1>
              <p className="stage-country">{stage.country}</p>
            </div>
            
            <div className="stage-stats-grid">
              <div className="stage-stat">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="stat-value">{formatKm(stage.km)}</span>
                <span className="stat-label">Distancia</span>
              </div>
              <div className="stage-stat">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="stat-value">{formatMeters(stage.elevationGain)}</span>
                <span className="stat-label">Desnivel</span>
              </div>
              <div className="stage-stat">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="stat-value">{estimatedTime}</span>
                <span className="stat-label">Tiempo estimado</span>
              </div>
              <div className="stage-stat">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="stat-value">{formatDate(stage.createdAt)}</span>
                <span className="stat-label">Fecha</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="stage-content">
          <div className="container">
            {stage.description && (
              <div className="stage-description">
                <h2>Descripción</h2>
                <p>{stage.description}</p>
              </div>
            )}
            
            <div className="stage-route">
              <h2>Recorrido</h2>
              <div className="route-points">
                <div className="route-point start">
                  <div className="point-marker">
                    <span>A</span>
                  </div>
                  <div className="point-info">
                    <span className="point-label">Salida</span>
                    <span className="point-name">{stage.startName}</span>
                  </div>
                </div>
                <div className="route-connection">
                  <div className="connection-line"></div>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div className="route-point end">
                  <div className="point-marker">
                    <span>B</span>
                  </div>
                  <div className="point-info">
                    <span className="point-label">Llegada</span>
                    <span className="point-name">{stage.endName}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {stage.segments && stage.segments.length > 0 && (
              <div className="stage-segments">
                <h2>Segmentos</h2>
                <div className="segments-list">
                  {stage.segments.map((segment, index) => (
                    <div key={segment.id} className="segment-item">
                      <span className="segment-number">{index + 1}</span>
                      <div className="segment-info">
                        <span className="segment-name">{segment.startName} → {segment.endName}</span>
                        <span className="segment-stats">{segment.km} km | {segment.elevationGain} m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="stage-photos">
              <h2>Fotos de la etapa</h2>
              {stage.photos && stage.photos.length > 0 ? (
                <div className="photos-grid">
                  {stage.photos.slice(0, 6).map(photo => (
                    <div key={photo.id} className="photo-item">
                      <img src={photo.url} alt={photo.caption || 'Foto de la etapa'} />
                      {photo.caption && <p>{photo.caption}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-photos">Próximamente añadirémos fotos de esta etapa.</p>
              )}
            </div>
            
            <div className="stage-cta">
              <h3>¿Quieres ayudarnos a llegar más lejos?</h3>
              <p>Cada euro nos acerca un kilómetro más a Grecia.</p>
              <Button href="/donar">Donar ahora</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}