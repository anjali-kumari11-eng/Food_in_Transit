import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : { restaurantId: null, items: [] };
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (restaurantId, menuItem) => {
        setCart(prev => {
            // Check if adding from different restaurant
            if (prev.restaurantId && prev.restaurantId !== restaurantId) {
                if(!window.confirm("You have items from a different restaurant. Clear cart to add this item?")) {
                    return prev;
                }
                return {
                    restaurantId,
                    items: [{ ...menuItem, quantity: 1 }]
                };
            }

            const existingItem = prev.items.find(i => i._id === menuItem._id);
            let newItems;
            if (existingItem) {
                newItems = prev.items.map(i => 
                    i._id === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                newItems = [...prev.items, { ...menuItem, quantity: 1 }];
            }

            return { restaurantId, items: newItems };
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const existingItem = prev.items.find(i => i._id === itemId);
            let newItems;
            if (existingItem.quantity === 1) {
                newItems = prev.items.filter(i => i._id !== itemId);
            } else {
                newItems = prev.items.map(i => 
                    i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
            }

            return {
                restaurantId: newItems.length === 0 ? null : prev.restaurantId,
                items: newItems
            };
        });
    };

    const clearCart = () => setCart({ restaurantId: null, items: [] });

    const getCartTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const getCartCount = () => cart.items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
