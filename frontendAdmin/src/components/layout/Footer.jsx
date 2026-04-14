import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-parallax">
        <div className="footer-mountains">
          <div className="mountain mountain-1"></div>
          <div className="mountain mountain-2"></div>
          <div className="mountain mountain-3"></div>
          <div className="mountain mountain-4"></div>
        </div>
        <div className="footer-bike">🚴</div>
      </div>
      
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Con<span>Pedales</span></h3>
            <p className="footer-tagline">De Toledo a Grecia. Solo con nuestras piernas.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M2 12h20" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Explorar</h4>
            <ul className="footer-links">
              <li><Link to="/viaje">El Viaje</Link></li>
              <li><Link to="/diario">Diario</Link></li>
              <li><Link to="/mapa">Mapa</Link></li>
              <li><Link to="/comunidad">Comunidad</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Apoyar</h4>
            <ul className="footer-links">
              <li><Link to="/donar">Donar</Link></li>
              <li><a href="#">Merchandising</a></li>
              <li><a href="#">Patrocinios</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Términos de uso</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 ConPedales. Todos los derechos reservados. Cada pedalada cuenta.</p>
        </div>
      </div>
    </footer>
  );
}
