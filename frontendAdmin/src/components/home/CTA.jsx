import { useKmProgress } from '../../hooks/useStats';
import Button from '../common/Button';
import './CTA.css';

export default function CTA() {
  const { kmFinanced, totalDonors } = useKmProgress();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Impulsa la próxima pedalada</h2>
          <p>Cada euro nos acerca un poco más a Grecia</p>
          <div className="cta-button">
            <Button href="/donar" size="large">DONAR</Button>
          </div>
          <div className="cta-stats">
            <div className="cta-stat">
              <div className="cta-stat-value">{kmFinanced.toLocaleString('es-ES')}</div>
              <div className="cta-stat-label">km financiados</div>
            </div>
            <div className="cta-stat">
              <div className="cta-stat-value">{totalDonors}</div>
              <div className="cta-stat-label">donantes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}