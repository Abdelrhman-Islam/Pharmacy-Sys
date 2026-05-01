import React from 'react';
import '../layouts/Features.css'; // لو حابب تفصل الـ CSS بتاعه برضه

const Features = () => {
  return (
    <div className="features-wrapper">
      {/* Features Section */}
      <section className="features-section">
        <div className="section-title">
          <h2>لماذا تختار صيدليتي؟</h2>
          <p>نحن نسعى دائماً لتقديم أفضل تجربة رعاية صحية رقمية في مصر</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>أمان تام</h3>
            <p>تخزين ونقل الأدوية يتم تحت إشراف صيدلي كامل لضمان الجودة.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-hand-holding-usd"></i></div>
            <h3>أفضل الأسعار</h3>
            <p>نلتزم بأسعار وزارة الصحة مع عروض حصرية على منتجات التجميل.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-shipping-fast"></i></div>
            <h3>توصيل فائق السرعة</h3>
            <p>توصيل خلال ساعة واحدة لجميع الأدوية والمستلزمات داخل السويس.</p>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <div className="promo-text">
            <h2>عروض الويك إند!</h2>
            <p>وفر حتى 40% على جميع أنواع الفيتامينات والمكملات الغذائية.</p>
          </div>
          <button className="btn-accent">احصل على العرض</button>
        </div>
      </section>
    </div>
  );
};

export default Features;