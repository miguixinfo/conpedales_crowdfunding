import { useDonationFeed } from '../../hooks/useDonations';
import { adaptDonationsForCards } from '../../services/adapters';
import DonationCard from '../common/DonationCard';
import Loading from '../common/Loading';
import './DonationFeed.css';

export default function DonationFeed() {
  const { donations, loading } = useDonationFeed(6);

  if (loading) return <Loading />;

  const adaptedDonations = adaptDonationsForCards(donations);

  return (
    <section className="donation-feed">
      <div className="container">
        <div className="donation-header">
          <h2>Comunidad</h2>
          <p>Gente que ya nos acompaña en esta aventura</p>
        </div>
        
        <div className="donation-grid">
          {adaptedDonations.map((donation, index) => (
            <DonationCard key={index} donation={donation} />
          ))}
        </div>
      </div>
    </section>
  );
}