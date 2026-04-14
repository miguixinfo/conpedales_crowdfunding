import { useStages } from '../../hooks/useStages';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';
import Button from '../common/Button';
import './MapPreview.css';

export default function MapPreview() {
  const { stages, loading } = useStages();
  const navigate = useNavigate();

  if (loading) return <Loading />;

  const publishedStages = stages
    .filter(s => s.isPublished)
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .slice(0, 6);

  let accumulatedKm = 0;
  const points = publishedStages.map((stage, index) => {
    accumulatedKm += stage.km;
    const isFirst = index === 0;
    const isLast = index === publishedStages.length - 1;
    
    return {
      name: isFirst ? stage.startName : stage.endName,
      km: accumulatedKm,
      status: isLast ? 'active' : 'completed',
      dayNumber: stage.dayNumber,
      country: stage.country
    };
  });

  // Añadir punto final si hay etapas
  if (publishedStages.length > 0) {
    const lastStage = publishedStages[publishedStages.length - 1];
    points.push({
      name: 'Grecia',
      km: 5100,
      status: 'pending',
      dayNumber: null,
      country: 'Grecia'
    });
  }

  return (
    <section className="map-preview">
      <div className="container">
        <div className="map-header">
          <h2>Mapa del viaje</h2>
          <p>Nuestra ruta desde Toledo hasta Grecia</p>
        </div>
        
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-route-visual">
              <div className="map-route-line"></div>
              <div className="map-route-points">
                {points.map((point, index) => (
                  <div key={index} className="map-route-point">
                    <div className={`map-point-dot ${point.status}`}></div>
                    <span className="map-point-label">{point.name}</span>
                    <span className="map-point-km">{point.km.toLocaleString('es-ES')} km</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="map-overlay-text">
              <p>Seguimos pedaleando hacia Grecia</p>
              <span>Cada día añadimos nuevas etapas</span>
            </div>
          </div>
        </div>
        
        <div className="map-cta">
          <Button href="/mapa" variant="secondary">Ver mapa completo</Button>
        </div>
      </div>
    </section>
  );
}