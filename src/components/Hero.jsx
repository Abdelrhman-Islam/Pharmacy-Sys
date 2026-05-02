import { Link } from 'react-router-dom';
import '../layouts/HomeSections.css';

const Hero = () => {
  return (
    <header className="hero">
        {/* Hero content */}
        <div className="hero-content">
            <h1>رعاية صحية متكاملة <br />توصلك لحد باب البيت</h1>
            <p>أكبر تشكيلة من الأدوية، الفيتامينات، ومستحضرات العناية. ارفع الروشتة وسيب الباقي علينا.</p>
            
            {/* CTA buttons */}
            <div className="hero-buttons">
                <Link to="/upload-prescription" className="btn btn-primary">
                    ارفع الروشتة <i className="fas fa-file-upload"></i>
                </Link>
                <Link to="/products" className="btn btn-outline">تصفح المنتجات</Link>
            </div>
        </div>

        {/* Hero image */}
        <div className="hero-image">
            <img 
            src="https://img.freepik.com/free-vector/delivery-service-with-masks-concept_23-2148505104.jpg?w=740" 
            alt="Pharmacy Delivery Service" 
            />
        </div>
    </header>
  );
};

export default Hero;