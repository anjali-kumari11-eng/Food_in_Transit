import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);

    const { API_URL } = useContext(AuthContext);
    const { cart, addToCart, removeFromCart, getCartTotal } = useContext(CartContext);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const resRest = await axios.get(`${API_URL}/api/restaurants/${id}`);
                setRestaurant(resRest.data.data);
                const resMenu = await axios.get(`${API_URL}/api/restaurants/${id}/menu`);
                setMenu(resMenu.data.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [id, API_URL]);

    if (loading) return <div className="loader"></div>;
    if (!restaurant) return (
        <div className="empty-state">
            <i className="fas fa-store-slash"></i>
            <h2>Restaurant not found</h2>
            <p>This restaurant may have been removed or is unavailable.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
    );

    const isOpen = () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = (restaurant.openTime || '09:00').split(':').map(Number);
        const [closeH, closeM] = (restaurant.closeTime || '23:00').split(':').map(Number);
        const openMin = openH * 60 + openM;
        const closeMin = closeH * 60 + closeM;
        if (closeMin <= openMin) return currentMinutes >= openMin || currentMinutes <= closeMin;
        return currentMinutes >= openMin && currentMinutes <= closeMin;
    };

    const getItemCount = (itemId) => {
        const item = cart.items.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };

    // Categories from the menu
    const categories = ['All', ...new Set(menu.map(item => item.category))];

    // Filter menu
    const filteredMenu = menu.filter(item => {
        if (!item.isAvailable) return false;
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesVeg = !vegOnly || item.isVeg;
        return matchesCategory && matchesVeg;
    });

    const getDiscountedPrice = (price, discount) => {
        if (!discount || discount === 0) return price;
        return price - (price * discount / 100);
    };

    const open = isOpen();

    return (
        <div>
            {/* Banner */}
            <div className="detail-banner" style={{ backgroundImage: `url(${restaurant.image})` }}>
                <div className="detail-banner-overlay">
                    <div className="container detail-banner-content">
                        <div style={{ marginBottom: 8 }}>
                            <span className={`open-badge ${open ? 'open' : 'closed'}`} style={{ fontSize: '0.75rem' }}>
                                <i className={`fas ${open ? 'fa-door-open' : 'fa-door-closed'}`}></i> {open ? 'Open Now' : 'Closed'}
                            </span>
                        </div>
                        <h1>{restaurant.name}</h1>
                        <div className="detail-meta">
                            <span><i className="fas fa-star" style={{ color: '#facc15' }}></i> {restaurant.rating.toFixed(1)} ({restaurant.numReviews || 0} reviews)</span>
                            <span><i className="fas fa-utensils"></i> {restaurant.cuisines.join(', ')}</span>
                            <span><i className="fas fa-clock"></i> {restaurant.openTime || '09:00'} — {restaurant.closeTime || '23:00'}</span>
                            <span><i className="fas fa-map-marker-alt"></i> {restaurant.address?.street}, {restaurant.address?.city}</span>
                        </div>
                        <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.7)', maxWidth: 600 }}>{restaurant.description}</p>
                    </div>
                </div>
            </div>

            {/* Menu section */}
            <div className="container menu-section">
                {/* Filters */}
                <div className="menu-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        className={`veg-toggle ${vegOnly ? 'active' : ''}`}
                        onClick={() => setVegOnly(!vegOnly)}
                    >
                        <span className={`veg-dot`}></span> Veg Only
                    </button>
                </div>

                <div className="menu-layout">
                    {/* Menu Items */}
                    <div className="menu-content">
                        {filteredMenu.length === 0 ? (
                            <div className="empty-state" style={{ padding: '40px 0' }}>
                                <i className="fas fa-leaf"></i>
                                <h2 style={{ fontSize: '1.3rem' }}>No items found</h2>
                                <p>Try removing filters to see more items</p>
                            </div>
                        ) : (
                            filteredMenu.map(item => {
                                const hasDiscount = item.discount > 0;
                                const finalPrice = getDiscountedPrice(item.price, item.discount);
                                return (
                                    <div key={item._id} className="menu-item fade-in">
                                        <div className="menu-item-info">
                                            <div className="menu-item-name">
                                                <span className={item.isVeg ? 'veg-dot' : 'veg-dot nonveg-dot'}></span>
                                                {item.name}
                                                {hasDiscount && <span className="discount-tag">{item.discount}% OFF</span>}
                                            </div>
                                            <div className="menu-item-price">
                                                {hasDiscount && <span className="price-original">${item.price.toFixed(2)}</span>}
                                                <span>${finalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="menu-item-desc">{item.description}</div>
                                        </div>
                                        <div className="menu-item-img-wrap">
                                            <img src={item.image} alt={item.name} className="menu-item-img" />
                                            <div className="menu-item-add-wrap">
                                                <div className="add-btn">
                                                    {getItemCount(item._id) === 0 ? (
                                                        <button onClick={() => addToCart(restaurant._id, { ...item, price: finalPrice })}>ADD</button>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => removeFromCart(item._id)}>−</button>
                                                            <span className="count">{getItemCount(item._id)}</span>
                                                            <button onClick={() => addToCart(restaurant._id, { ...item, price: finalPrice })}>+</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Cart Sidebar */}
                    {cart.items.length > 0 && cart.restaurantId === restaurant._id && (
                        <div className="menu-sidebar">
                            <div className="cart-sidebar">
                                <h3><i className="fas fa-shopping-cart" style={{ color: 'var(--primary)' }}></i> Your Order</h3>
                                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                                    {cart.items.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <div>
                                                <div className="cart-item-name">{item.name}</div>
                                                <div className="cart-item-price">${item.price.toFixed(2)} × {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-sm">
                                                <div className="add-btn" style={{ fontSize: '0.8rem' }}>
                                                    <button onClick={() => removeFromCart(item._id)} style={{ padding: '4px 8px' }}>−</button>
                                                    <span className="count" style={{ padding: '4px 8px' }}>{item.quantity}</span>
                                                    <button onClick={() => addToCart(restaurant._id, item)} style={{ padding: '4px 8px' }}>+</button>
                                                </div>
                                                <span style={{ fontWeight: 700, minWidth: 60, textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-total">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/checkout')}>
                                    <i className="fas fa-arrow-right"></i> Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;
