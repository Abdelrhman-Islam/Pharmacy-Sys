import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import '../layouts/Orders.css'; // اعمل ملف CSS عشان تنسق الشكل

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${BASE_URL}api/orders/get_my_orders.php`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const result = await response.json();
                if (result.status === 'success') {
                    setOrders(result.data);
                } else {
                    toast.error("فشل تحميل الطلبات");
                }
            } catch (error) {
                toast.error("خطأ في الاتصال بالسيرفر");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <>
            <Navbar />
            <div className="orders-container">
                <h2>طلباتي</h2>
                {loading ? <p>جاري التحميل...</p> : 
                    orders.length === 0 ? <p>لا توجد طلبات سابقة.</p> :
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div><strong>طلب رقم:</strong> #{order.id}</div>
                                <div><strong>الإجمالي:</strong> {order.total_amount} ج.م</div>
                                <div><strong>الحالة:</strong> <span className={`status-${order.status}`}>{order.status}</span></div>
                                <div><strong>التاريخ:</strong> {new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <Footer/>
        </>
    );
};

export default MyOrdersPage;