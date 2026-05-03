import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/ordersService';
import { toast } from 'react-toastify';
import '../../layouts/Orders.css';

const OrdersPage = () => {
    const [data, setData] = useState({ summary: {}, orders: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders()
            .then(res => setData(res))
            .finally(() => setLoading(false));
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'status completed';
            case 'in_transit': return 'status transit';
            case 'pending': return 'status pending';
            case 'cancelled': return 'status cancelled';
            default: return 'status';
        }
    };
    
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // 1. تحديث UI مباشرة (سريع)
            setData(prev => ({
                ...prev,
                orders: prev.orders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            }));
            toast.success('تم التحديث بنجاح');
            // 2. ابعت للـ API
            await updateOrderStatus(orderId, newStatus);

        } catch (err) {
            console.error("Update failed", err);
            toast.error('حدث خطأ');
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'مكتمل';
            case 'in_transit': return 'قيد التوصيل';
            case 'pending': return 'قيد الانتظار';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    if (loading) return <p className="loading">Loading...</p>;

    return (
        <div className="orders-page">

            {/* 🔹 Header */}
            <div className="orders-header">
                <h2>الطلبات</h2>
                <p>إدارة ومتابعة جميع الطلبات</p>
            </div>

            {/* 🔹 Summary Cards */}
            <div className="orders-cards">
                <div className="card total">
                    <span>إجمالي الطلبات</span>
                    <h3>{data.summary.total}</h3>
                </div>

                <div className="card completed">
                    <span>مكتملة</span>
                    <h3>{data.summary.completed}</h3>
                </div>

                <div className="card transit">
                    <span>قيد التوصيل</span>
                    <h3>{data.summary.in_transit}</h3>
                </div>

                <div className="card pending">
                    <span>قيد الانتظار</span>
                    <h3>{data.summary.pending}</h3>
                </div>

                <div className="card cancelled">
                    <span>ملغية</span>
                    <h3>{data.summary.cancelled}</h3>
                </div>
            </div>

            {/* 🔹 Table */}
            <div className="orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>الهاتف</th>
                            <th>التاريخ</th>
                            <th>الإجمالي</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.customer_name}</td>
                                <td>{order.phone}</td>
                                <td>{order.created_at}</td>
                                <td>{order.total_amount} ج.م</td>
                                <td>
                                    <select
                                        className={`status-dropdown ${getStatusClass(order.status)}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="in_transit">قيد التوصيل</option>
                                        <option value="completed">مكتمل</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default OrdersPage;