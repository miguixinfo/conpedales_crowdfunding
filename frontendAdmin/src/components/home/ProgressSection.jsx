import { useKmProgress } from '../../hooks/useStats';
import { TRIP_INFO, DONATION_CONFIG } from '../../config/constants';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import Loading from '../common/Loading';
import './ProgressSection.css';

export default function ProgressSection() {
  const { kmFinanced, totalFunded, loading } = useKmProgress();

  if (loading) return <Loading />;

  const goalKm = TRIP_INFO.totalKmGoal;
  const percentage = goalKm > 0 ? Math.min(100, Math.round((kmFinanced / goalKm) * 100)) : 0;

  return (
    <section className="progress-section">
      <div className="container">
        <div className="progress-card">
          <div className="progress-header">
            <h2>La comunidad ya ha financiado:</h2>
            <p>Cada euro nos acerca un kilómetro más a Grecia</p>
          </div>
          
          <div className="progress-highlight">
            {kmFinanced.toLocaleString('es-ES')} km
          </div>
          
          <div className="progress-bar-section">
            <ProgressBar current={kmFinanced} total={goalKm} />
            <div className="progress-info">
              <span>Objetivo: {goalKm.toLocaleString('es-ES')} km</span>
              <span className="progress-rate">100 km ≈ {(100 * DONATION_CONFIG.pricePerKm).toFixed(0)}€</span>
            </div>
          </div>
          
          <div className="progress-cta">
            <p>Ayúdanos a pedalear más lejos</p>
            <Button href="/donar" size="large">Donar ahora</Button>
          </div>
        </div>
      </div>
    </section>
  );
}