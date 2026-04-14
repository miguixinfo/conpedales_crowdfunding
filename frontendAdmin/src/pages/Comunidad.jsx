import { useDonations } from '../hooks/useDonations';
import { useStats } from '../hooks/useStats';
import { adaptDonationsForCards } from '../services/adapters';
import { DONATION_CONFIG } from '../config/constants';
import DonationCard from '../components/common/DonationCard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './Comunidad.css';

export default function Comunidad() {
  const { donations, loading: donationsLoading } = useDonations();
  const { stats, loading: statsLoading } = useStats();

  if (donationsLoading || statsLoading) return <Loading />;

  const adaptedDonations = adaptDonationsForCards(donations);
  const totalDonated = stats?.totalFunded || 0;
  const kmFinanced = Math.floor(totalDonated / DONATION_CONFIG.pricePerKm);

  return (
    <>
      <Navbar />
      <div className="comunidad-page">
        <div className="comunidad-hero">
          <div className="container">
            <h1>Comunidad</h1>
            <p>Gente que cree en nosotros y nos acompaña en esta aventura</p>
          </div>
        </div>
        
        <div className="comunidad-content">
          <div className="comunidad-stats">
            <div className="comunidad-stat">
              <div className="comunidad-stat-value">{stats?.totalDonors || 0}</div>
              <div className="comunidad-stat-label">Donantes</div>
            </div>
            <div className="comunidad-stat">
              <div className="comunidad-stat-value">{totalDonated.toLocaleString('es-ES')}€</div>
              <div className="comunidad-stat-label">Total donado</div>
            </div>
            <div className="comunidad-stat">
              <div className="comunidad-stat-value">{kmFinanced.toLocaleString('es-ES')}</div>
              <div className="comunidad-stat-label">Km financiados</div>
            </div>
          </div>
          
          <div className="comunidad-section">
            <h2>Todas las donaciones</h2>
            <div className="comunidad-feed">
              {adaptedDonations.map((donation, index) => (
                <DonationCard key={index} donation={donation} />
              ))}
            </div>
          </div>
          
          <div className="comunidad-cta">
            <h3>¿Quieres unirte a la comunidad?</h3>
            <p>Cada euro nos acerca un poco más a Grecia. Tu apoyo importa.</p>
            <Button href="/donar" size="large">Donar ahora</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}