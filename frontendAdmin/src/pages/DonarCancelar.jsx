import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import './DonarCancelar.css';

export default function DonarCancelar() {
  return (
    <>
      <Navbar />
      <div className="donar-cancelar-page">
        <div className="cancelar-container">
          <div className="cancelar-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1>Pago cancelado</h1>
          
          <p className="cancelar-message">
            El proceso de pago fue cancelado. Si tuviste algún problema, 
            puedes intentarlo de nuevo o contactarnos directamente.
          </p>
          
          <div className="cancelar-actions">
            <Button href="/donar" variant="primary" size="large">
              Intentar de nuevo
            </Button>
            <Button href="/" variant="secondary" size="large">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}