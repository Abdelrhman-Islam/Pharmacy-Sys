// components/orders/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { BASE_URL } from '../../api/config';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // دالة الإضافة الموحدة
    const addToCart = async (product) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}api/orders/add_to_cart.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: product.id, quantity: 1 })
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                toast.success(`تمت إضافة ${product.name} للسلة!`);
                setCart(prev => [...prev, product]); // تحديث الـ UI
            } else {
                toast.error(`خطأ: ${result.message}`);
            }
        } catch (error) {
            toast.error('حدث خطأ في الاتصال بالسيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);