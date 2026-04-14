import { useStats } from '../../hooks/useStats';
import './Hero.css';

export default function Hero() {
  const { stats } = useStats();

  const totalKm = stats?.totalKm ?? 3400;
  const estimatedDays = 90;
  const countries = 12;

  return (
    <section className="hero">
      <div className="hero-bg-pattern"></div>
      <div className="hero-grid"></div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          De Toledo a Grecia
        </div>
        
        <h1 className="hero-title">
          Con<span>Pedales</span>
        </h1>
        
        <p className="hero-subtitle">
          Miles dekilómetros. Cientos de pedaladas. Una aventura que queremos compartir contigo.
        </p>
        
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{totalKm.toLocaleString('es-ES')}</span>
            <span className="hero-stat-label">Kilómetros</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{estimatedDays}</span>
            <span className="hero-stat-label">Días</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{countries}</span>
            <span className="hero-stat-label">Países</span>
          </div>
        </div>
        
        <div className="hero-buttons">
          <a href="/viaje" className="hero-btn hero-btn-primary">Ver el viaje</a>
          <a href="/donar" className="hero-btn hero-btn-secondary">Donar</a>
        </div>
      </div>
      
      <div className="hero-scroll">
        <div className="hero-scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}