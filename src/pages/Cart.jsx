// Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../layouts/CartPage.css'; 
import { BASE_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';



const CartPage = () => {
    const { cart, loading, removeFromCart, updateQuantity } = useCart(); 
     const navigate = useNavigate();
    const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    const shipping = 20; 
    const total = subtotal + shipping;

    if (loading) return <div className="loading">جاري تحميل السلة...</div>;
    return (
        <div className="pharmacy-cart-page">
            <Navbar />
            
            <main className="cart-grid">
                <aside className="cart-summary-section">
                    <h3>ملخص الطلب</h3>
                    
                    <div className="summary-details">
                        <div className="summary-row">
                            <span className="label">المجموع الفرعي:</span>
                            <span className="value">{subtotal.toFixed(2)} ج.م</span>
                        </div>
                        <div className="summary-row">
                            <span className="label">التوصيل:</span>
                            <span className="value">{shipping.toFixed(2)} ج.م</span>
                        </div>
                        <div className="total-row">
                            <span className="label">الإجمالي:</span>
                            <span className="value">{total.toFixed(2)} ج.م</span>
                        </div>
                    </div>

                    <button  onClick={() => navigate('/checkout')} className="btn-checkout">
                        <i className="fas fa-check"></i> إتمام الشراء
                    </button>
                </aside>

                <section className="cart-items-section">
                    <div className="section-header">
                        <i className="fas fa-shopping-bag"></i> 
                        <h2>سلة المشتريات</h2>
                    </div>

                    {cart.length === 0 ? (
                        <div className="empty-cart">السلة فارغة حالياً</div>
                    ) : (
                        <div className="cart-items-list">
                            { cart.map((item) => (
                                <div key={item.id} className="cart-item-card">
                                    
                                    {/* زر الحذف باللون الأحمر الخفيف */}
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>

                        <div className="quantity-controls">
                            <button 
                                className="btn-qty" 
                                onClick={() => updateQuantity(item.id, parseInt(item.quantity) - 1)}
                                disabled={parseInt(item.quantity) <= 1} // بيقفل الزرار لو الكمية 1
                            > - </button>
                            
                            <span className="qty-value">{item.quantity}</span>
                            
                            <button 
                                className="btn-qty" 
                                onClick={() => updateQuantity(item.id, parseInt(item.quantity) + 1)}
                            >+</button>
                        </div>

                                    {/* معلومات المنتج */}
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <p className="item-price-qty">
                                            {item.quantity} × {item.price} ج.م = 
                                            <strong> {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)} ج.م</strong>
                                        </p>
                                    </div>
                                    <img src={`${BASE_URL}uploads/products/${item.pic}`} alt={item.name} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer/>
        </div>
    );
};

export default CartPage;