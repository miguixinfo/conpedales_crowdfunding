import './DonationCard.css';

export default function DonationCard({ donation }) {
  const initial = donation.name.charAt(0).toUpperCase();
  
  return (
    <div className="donation-card">
      <div className="donation-avatar">{initial}</div>
      <div className="donation-info">
        <div className="donation-header">
          <span className="donation-name">{donation.name}</span>
          <span className="donation-amount">{donation.amount}€</span>
        </div>
        {donation.comment && (
          <p className="donation-comment">"{donation.comment}"</p>
        )}
        <span className="donation-date">{donation.date}</span>
      </div>
    </div>
  );
}