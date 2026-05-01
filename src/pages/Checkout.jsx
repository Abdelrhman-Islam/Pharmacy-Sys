import React, { useState } from 'react';
import { BASE_URL } from '../api/config';
import { useCart } from '../components/orders/CartContext';
import { toast } from 'react-toastify';
import '../layouts/Checkout.css';

const CheckoutPage = () => {
    const { cart, setCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: 'القاهرة' });

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return toast.warn("السلة فارغة!");

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}api/orders/checkout.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, total: totalAmount, cartItems: cart })
            });

            const result = await response.json();

            if (result.status === 'success') {
                toast.success(`تم الطلب بنجاح! رقم الطلب: ${result.order_id}`);
                setCart([]); // تصفير السلة بعد نجاح الطلب
            } else {
                toast.error(`خطأ في الطلب: ${result.message}`);
            }
        } catch (error) {
            toast.error('حدث خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    //  return (
    //     <form onSubmit={handleCheckout} className="checkout-form">
    //         <input name="name" placeholder="الاسم الكامل" onChange={handleChange} required />
    //         <input name="phone" placeholder="رقم الهاتف" onChange={handleChange} required />
    //         <input name="address" placeholder="العنوان بالتفصيل" onChange={handleChange} required />
            
    //         <select name="city" onChange={handleChange}>
    //             <option value="القاهرة">القاهرة</option>
    //             <option value="الجيزة">الجيزة</option>
    //         </select>

    //         <button type="submit" disabled={loading}>
    //             {loading ? 'جاري الإرسال...' : `تأكيد الطلب (${totalAmount} ج.م)`}
    //         </button>
    //     </form>
    // );
    return (
            <div className="checkout-container"> {/* ضفنا حاوية هنا */}
                <form onSubmit={handleCheckout} className="checkout-form">
                    <h2>إتمام الطلب</h2>
                    <input name="name" placeholder="الاسم الكامل" onChange={handleChange} required />
                    <input name="phone" placeholder="رقم الهاتف" onChange={handleChange} required />
                    <input name="address" placeholder="العنوان بالتفصيل" onChange={handleChange} required />
                    
                    <select name="city" onChange={handleChange}>
                        <option value="القاهرة">القاهرة</option>
                        <option value="الجيزة">الجيزة</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? 'جاري الإرسال...' : `تأكيد الطلب (${totalAmount} ج.م)`}
                    </button>
                </form>
            </div>
    );
};

export default CheckoutPage;