import React, { createContext, useState, useEffect, useContext } from 'react';
import { BASE_URL } from '../api/config';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart
    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }

        try {
            const res = await fetch(`${BASE_URL}api/cart/get_cart.php`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
            });
            const data = await res.json();
            setCart(data || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    // Add product
    const addToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error("يجب تسجيل الدخول"); return; }
        
        try {
            const res = await fetch(`${BASE_URL}api/cart/cart_action.php`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    action: 'add', 
                    product_id: product.id, 
                    quantity: 1 
                })
            });
            
            const result = await res.json();
            
            if (result.status === 'success') {
                toast.success("تمت الإضافة للسلة!");
                fetchCart();
            } else {
                toast.error(result.message || "حدث خطأ");
            }
        } catch (error) { 
            console.error("Error:", error);
            toast.error("خطأ في الاتصال بالسيرفر"); 
        }
    };

    // Remove product
    const removeFromCart = async (id) => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${BASE_URL}api/cart/cart_action.php`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ action: 'delete', id: id })
            });
            
            const data = await res.json();
            if(data.status === 'success') {
                setCart(prev => prev.filter(item => item.id !== id));
                toast.success("تم الحذف");
            }
        } catch (error) { console.error("Error deleting:", error); }
    };

    // Update quantity
    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return;
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${BASE_URL}api/cart/cart_action.php`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ action: 'update', id: id, quantity: newQty })
            });
            
            const data = await res.json();
            if(data.status === 'success') {
                setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
            }
        } catch (error) { console.error("Error updating:", error); }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);