import { useState } from 'react';
import { publicApi } from '../services/api';
import { DONATION_CONFIG } from '../config/constants';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import './Donar.css';

const amounts = [5, 10, 20, 50, 100];
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

export default function Donar() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const kmFinanced = Math.floor(finalAmount / DONATION_CONFIG.pricePerKm);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) return;
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await publicApi.createCheckout({
        amount: finalAmount,
        name: formData.name,
        email: formData.email || undefined,
        comment: formData.comment || undefined,
        successUrl: `${BASE_URL}/donar/exito`,
        cancelUrl: `${BASE_URL}/donar/cancelar`
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="donar-page">
        <div className="donar-hero">
          <div className="container">
            <h1>Donar</h1>
            <p>Ayúdanos a llegar al Egeo. Cada euro cuenta.</p>
          </div>
        </div>
        
        <div className="donar-content">
          <div className="donar-explanation">
            <h3>¿Por qué donar?</h3>
            <p>
              Si quieres ayudarnos a llegar a Grecia puedes aportar cualquier cantidad.
              <span className="highlight"> Cada euro cuenta.</span>
              <br /><br />
              Las donaciones superiores a 10€ recibirán un pequeño regalo del viaje.
            </p>
          </div>
          
          {error && (
            <div className="donar-error">
              {error}
            </div>
          )}
          
          <form className="donar-form" onSubmit={handleSubmit}>
            <div className="donar-section">
              <h3>Selecciona un importe</h3>
              <div className="amount-buttons">
                {amounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`amount-btn ${selectedAmount === amount ? 'selected' : ''}`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    {amount}€
                  </button>
                ))}
              </div>
              <div className="custom-amount">
                <span>Otro:</span>
                <input
                  type="number"
                  placeholder="Importe personalizado"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min="1"
                />
              </div>
              {finalAmount > 0 && (
                <div className="km-indicator">
                  <p>Esto financia aproximadamente: <strong>{kmFinanced} km</strong></p>
                </div>
              )}
            </div>
            
            <div className="donar-section">
              <h3>Tus datos</h3>
              <input
                type="text"
                name="name"
                className="donar-input"
                placeholder="Tu nombre *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                className="donar-input"
                placeholder="Tu email (opcional)"
                value={formData.email}
                onChange={handleInputChange}
              />
              <textarea
                name="comment"
                className="donar-textarea"
                placeholder="Mensaje opcional (se publicará con tu donación)"
                value={formData.comment}
                onChange={handleInputChange}
              />
            </div>
            
            <Button 
              type="submit" 
              size="large" 
              className="donar-submit"
              disabled={!finalAmount || !formData.name.trim() || submitting}
            >
              {submitting ? 'Redirigiendo al pago...' : 'Continuar al pago'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}