import React from "react";
import { BASE_URL } from '../../api/config';
import { toast } from 'react-toastify';

const addToCart = async (product) => {
    try {
        const response = await fetch(`${BASE_URL}api/cart/add_to_cart.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1 // Default or selected quantity
            })
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            toast.success(`تمت إضافة ${product.name} للسلة بنجاح!`);
        } else {
            toast.error(`خطأ: ${result.message}`);
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('حدث خطأ في الاتصال بالسيرفر');
    }
};

export default addTocart;