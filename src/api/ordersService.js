// src/api/ordersService.js
import { BASE_URL } from './config';

export const fetchOrders = async () => {
    try {
        const response = await fetch(`${BASE_URL}api/admin/orders/get_orders.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API Failure!');
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await fetch(`${BASE_URL}api/admin/orders/update_status.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            order_id: orderId,
            status: status
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const fetchLatestOrders = async () => {
    const response = await fetch(`${BASE_URL}api/admin/orders/latest_orders.php`, {
        headers: {
            'Authorization': `${localStorage.getItem('token')}`
        }
    });

    return await response.json();
};