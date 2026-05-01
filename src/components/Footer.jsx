import { Link } from 'react-router-dom';
import '../layouts/Footer.css';
const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="logo" style={{ color: 'white', marginBottom: '15px' }}>
            <i className="fas fa-prescription-bottle-alt"></i> صيدليتي
          </h3>
          <p>منصة رقمية رائدة تربطك بأفضل الخدمات الصيدلانية في مصر، نسعى لرقمنة القطاع الطبي لتسهيل حياة المريض.</p>
        </div>
        
        <div className="footer-col">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link to="/faq">الأسئلة الشائعة</Link></li>
            <li><Link to="/returns">سياسة الترجيع</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/branches">فروعنا</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>تواصل معنا</h3>
          <p><i className="fas fa-phone-alt"></i> الخط الساخن: 19XXX</p>
          <p><i className="fas fa-envelope"></i> info@mypharma.com</p>
          <div style={{ marginTop: '20px', fontSize: '1.5rem', display: 'flex', gap: '18px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#ccfbf1' }}><i className="fab fa-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#ccfbf1' }}><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/201026061450" target="_blank" rel="noreferrer" style={{ color: '#ccfbf1' }}><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px', opacity: '0.5', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        &copy; {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;