import React from "react";
import { BASE_URL } from '../../api/config';
import { toast } from 'react-toastify';

const addToCart = async (product) => {
    try {
        const response = await fetch(`${BASE_URL}api/orders/add_to_cart.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1 // أو الكمية اللي المستخدم اختارها
            })
        });

        const result = await response.json();
        
    if (result.status === 'success') {
    // استبدل الـ alert(....) بـ toast.success
    toast.success(`تمت إضافة ${product.name} للسلة بنجاح!`);
    } else {
        // استبدل الـ alert(....) بـ toast.error
        toast.error(`خطأ: ${result.message}`);
    }

    // ... وفي الـ catch (الخطأ بتاع الشبكة)
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('حدث خطأ في الاتصال بالسيرفر');
    }
};

export default addTocart;