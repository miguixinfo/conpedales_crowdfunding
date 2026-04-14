import { TRIP_INFO, PREVIOUS_TRIPS } from '../config/constants';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './ElViaje.css';

export default function ElViaje() {
  return (
    <>
      <Navbar />
      <div className="elviaje-page">
        <div className="elviaje-hero">
          <div className="container">
            <h1>El Viaje</h1>
            <p className="tagline">{TRIP_INFO.title}</p>
            <p>{TRIP_INFO.subtitle}</p>
          </div>
        </div>
        
        <div className="elviaje-content">
          <div className="story-section">
            <h2>Nuestra historia</h2>
            <p>
              {TRIP_INFO.description}
            </p>
            
            <div className="story-highlight">
              <div className="story-stat">
                <div className="story-stat-value">{TRIP_INFO.totalKmGoal.toLocaleString('es-ES')}</div>
                <div className="story-stat-label">kilómetros</div>
              </div>
              <div className="story-stat">
                <div className="story-stat-value">{TRIP_INFO.estimatedDays}</div>
                <div className="story-stat-label">días estimados</div>
              </div>
              <div className="story-stat">
                <div className="story-stat-value">12</div>
                <div className="story-stat-label">países</div>
              </div>
            </div>
          </div>
          
          <div className="previous-trips">
            <h2>Viajes anteriores</h2>
            <div className="previous-trips-grid">
              {PREVIOUS_TRIPS.map(trip => (
                <div key={trip.id} className="trip-card">
                  <div className="trip-image">
                    {trip.image ? (
                      <img src={trip.image} alt={trip.title} className="trip-img" />
                    ) : (
                      trip.icon === 'camino' ? '⛪' : '🏔️'
                    )}
                  </div>
                  <div className="trip-content">
                    <div className="trip-header">
                      <h3 className="trip-title">{trip.title}</h3>
                      <span className="trip-year">{trip.year}</span>
                    </div>
                    <p className="trip-distance">{trip.distance} km</p>
                    <p className="trip-description">{trip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}