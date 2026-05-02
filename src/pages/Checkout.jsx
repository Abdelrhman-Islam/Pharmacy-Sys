import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. أضفنا useNavigate للتحويل
import { BASE_URL } from '../api/config';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../layouts/Checkout.css';

const CheckoutPage = () => {
    const { cart } = useCart();
    const navigate = useNavigate(); // 2. تعريف الهوك ده
    const [availableCities, setAvailableCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        phone: '', 
        address: '', 
        city: 'القاهرة' 
    });

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // 3. جلب بيانات المستخدم (Auto-fill)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}api/user/profile.php`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const result = await response.json();
                if (result.status === 'success') {
                    setFormData(prev => ({
                        ...prev,
                        name: result.data.name || '',
                        phone: result.data.phone || '',
                        address: result.data.address || '',
                        city: result.data.city || 'القاهرة'
                    }));
                }
            } catch (error) {
                console.error("فشل جلب البيانات:", error);
            }
        };

        // جوه الـ useEffect
        const fetchCities = async () => {
            try {
                // اتأكد إن المسار بيشاور على الملف الجديد
                const response = await fetch(`${BASE_URL}api/orders/get_cities.php`);
                const result = await response.json();
                if (result.status === 'success') {
                    setAvailableCities(result.data);
                }
            } catch (error) {
                console.error("فشل جلب المدن:", error);
            }
        };
        
        fetchCities();
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. تعديل الـ Checkout عشان يبعت الداتا للـ Backend
    const handleCheckout = async (e) => {
        e.preventDefault(); // ضروري عشان ميعملش Refresh للصفحة
        setLoading(true);
        
        try {
            const response = await fetch(`${BASE_URL}api/orders/checkout.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // إرسال الداتا اللي المستخدم عدلها
            });

            const result = await response.json();

            if (result.status === 'success') {
                toast.success('تمت عملية الشراء بنجاح! رقم طلبك: ' + result.order_id);
                navigate('/my-orders'); 
            } else {
                toast.error(result.message || 'فشل إتمام الطلب');
            }
        } catch (error) {
            toast.error('خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar/>
            <div className="checkout-container"> 
               <form onSubmit={handleCheckout} className="checkout-form">
                    <h2>إتمام الطلب</h2>
                    {/* 5. الـ Inputs بقت "Controlled Components" مربوطة بـ formData */}
                    <input name="name" value={formData.name} placeholder="الاسم الكامل" onChange={handleChange} required />
                    <input name="phone" value={formData.phone} placeholder="رقم الهاتف" onChange={handleChange} required />
                    <input name="address" value={formData.address} placeholder="العنوان بالتفصيل" onChange={handleChange} required />
                    
            <select 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                required
            >
                {/* 1. خيار افتراضي */}
                <option value="" disabled>اختر المدينة</option>

                {/* 2. نتأكد إننا بنعرض المدن اللي جاية من الداتابيز */}
                {availableCities.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}

                {/* 3. خطوة أمان: لو مدينة المستخدم الحالية مش موجودة في اللستة (مثلاً داتا قديمة)، نعرضها عشان ما تبقاش فاضية */}
                {formData.city && !availableCities.includes(formData.city) && (
                    <option value={formData.city}>{formData.city}</option>
                )}
            </select>

                    <button type="submit" disabled={loading}>
                        {loading ? 'جاري الإرسال...' : `تأكيد الطلب (${totalAmount+20} ج.م)`}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CheckoutPage;