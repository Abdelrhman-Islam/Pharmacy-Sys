import React, { useEffect, useState } from 'react';
import { fetchLatestOrders } from '../../api/ordersService';
import '../../layouts/admin/LatestOrders.css';
const LatestOrders = () => {
    const [orders, setOrders] = useState([]);
    const getStatusText = (status) => {
    switch (status) {
            case 'completed': return 'مكتمل';
            case 'in_transit': return 'قيد التوصيل';
            case 'pending': return 'قيد الانتظار';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'badge completed';
            case 'in_transit': return 'badge transit';
            case 'pending': return 'badge pending';
            case 'cancelled': return 'badge cancelled';
            default: return 'badge';
        }
    };
    useEffect(() => {
        fetchLatestOrders().then(res => {
            setOrders(res.orders);
        });
    }, []);

    return (
        <div className="latest-orders">
            <div className="section-header">
                <h3>أحدث الطلبات</h3>
                <a href="/admin/orders">عرض الكل</a>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>العميل</th>
                        <th>الحالة</th>
                        <th>السعر</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td className="order-id">#{order.id}</td>

                            <td className="customer-name">
                                {order.customer_name}
                            </td>

                            <td>
                                <span className={getStatusClass(order.status)}>
                                    {getStatusText(order.status)}
                                </span>
                            </td>

                            <td className="price">
                                {Number(order.total_amount).toLocaleString()} ج.م
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LatestOrders;