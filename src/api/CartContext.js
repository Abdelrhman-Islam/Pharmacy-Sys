// api/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart data
    const fetchCart = async () => {
        try {
            const response = await fetch('api/get_cart.php');
            const data = await response.json();
            setCart(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Remove item from cart
    const removeFromCart = async (id) => {
        let formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);

        try {
            const response = await fetch('cart_action.php', { method: 'POST', body: formData });
            const data = await response.json();
            if(data.status === 'success') {
                // Remove item from state
                setCart(prevCart => prevCart.filter(item => item.id !== id));
            }
        } catch (error) { console.error("Error deleting:", error); }
    };

    // Update item quantity
    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return; // Min qty validation

        let formData = new FormData();
        formData.append('action', 'update');
        formData.append('id', id);
        formData.append('quantity', newQty);

        try {
            const response = await fetch('cart_action.php', { method: 'POST', body: formData });
            const data = await response.json();
            if(data.status === 'success') {
                // Update quantity in state
                setCart(prevCart => prevCart.map(item => 
                    item.id === id ? { ...item, quantity: newQty } : item
                ));
            }
        } catch (error) { console.error("Error updating:", error); }
    };

    return (
        <CartContext.Provider value={{ cart, loading, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);