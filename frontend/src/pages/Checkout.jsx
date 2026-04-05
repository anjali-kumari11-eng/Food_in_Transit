import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { user, token, API_URL } = useContext(AuthContext);
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
    const [loading, setLoading] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    if (!user) {
        return (
            <div className="empty-state">
                <i className="fas fa-lock"></i>
                <h2>Please login to checkout</h2>
                <p>You need to be logged in to place an order.</p>
                <button className="btn-primary" onClick={() => navigate('/login')}>
                    <i className="fas fa-sign-in-alt"></i> Go to Login
                </button>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-shopping-bag"></i>
                <h2>Your cart is empty</h2>
                <p>Add some delicious items from our restaurants!</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    <i className="fas fa-utensils"></i> Find Food
                </button>
            </div>
        );
    }

    const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

    const deliveryFee = 2.99;
    const tax = getCartTotal() * 0.08;
    const total = getCartTotal() + deliveryFee + tax;

    const simulatePayment = () => {
        if (!address.street || !address.city) {
            alert('Please fill in required address fields (Street and City)');
            return;
        }
        setPaymentModal(true);
        setPaymentStatus('processing');

        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                placeOrder();
            }, 1000);
        }, 2000);
    };

    const placeOrder = async () => {
        try {
            const formattedItems = cart.items.map(i => ({
                menuItem: i._id,
                name: i.name,
                price: i.price,
                quantity: i.quantity
            }));

            const res = await axios.post(`${API_URL}/api/orders`, {
                restaurant: cart.restaurantId,
                items: formattedItems,
                totalAmount: getCartTotal(),
                deliveryAddress: address
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                clearCart();
                setPaymentModal(false);
                navigate(`/order/${res.data.data._id}`);
            }
        } catch (err) {
            console.error(err);
            setPaymentStatus('error');
        }
    };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: 32 }}>
                <i className="fas fa-credit-card" style={{ color: 'var(--primary)', marginRight: 12 }}></i>
                Checkout
            </h1>

            {/* Payment Modal */}
            {paymentModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ textAlign: 'center' }}>
                        {paymentStatus === 'processing' && (
                            <>
                                <div className="loader"></div>
                                <h3 style={{ fontSize: '1.3rem', marginTop: 8 }}>Processing Payment...</h3>
                                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Please do not close this window</p>
                            </>
                        )}
                        {paymentStatus === 'success' && (
                            <>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: 'var(--success)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', margin: '0 auto 16px'
                                }}><i className="fas fa-check"></i></div>
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--success)' }}>Payment Successful!</h3>
                                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Placing your order...</p>
                            </>
                        )}
                        {paymentStatus === 'error' && (
                            <>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: 'var(--error)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', margin: '0 auto 16px'
                                }}><i className="fas fa-times"></i></div>
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--error)' }}>Payment Failed</h3>
                                <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Something went wrong. Please try again.</p>
                                <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setPaymentModal(false)}>Try Again</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="checkout-grid">
                {/* Delivery Details */}
                <div className="card card-static" style={{ padding: 28 }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i> Delivery Address
                    </h2>
                    <div className="form-group">
                        <label className="form-label">Street Address *</label>
                        <input type="text" name="street" value={address.street} onChange={handleAddressChange}
                            className="form-input" placeholder="123 Main Street" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">City *</label>
                            <input type="text" name="city" value={address.city} onChange={handleAddressChange}
                                className="form-input" placeholder="New York" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">State</label>
                            <input type="text" name="state" value={address.state} onChange={handleAddressChange}
                                className="form-input" placeholder="NY" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Zip Code</label>
                        <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange}
                            className="form-input" placeholder="10001" />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card card-static" style={{ padding: 28, position: 'sticky', top: 88 }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-receipt" style={{ color: 'var(--primary)' }}></i> Order Summary
                    </h2>
                    <div style={{ marginBottom: 20 }}>
                        {cart.items.map(item => (
                            <div key={item._id} className="flex justify-between" style={{ marginBottom: 12, fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}× {item.name}</span>
                                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1.5px dashed var(--border)', paddingTop: 16 }}>
                        <div className="flex justify-between" style={{ marginBottom: 8, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between" style={{ marginBottom: 8, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-light)' }}>Delivery Fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between" style={{ marginBottom: 8, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-light)' }}>Taxes (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center" style={{
                        borderTop: '2px solid var(--text-main)', paddingTop: 16, marginTop: 8, marginBottom: 20
                    }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '16px' }} onClick={simulatePayment}>
                        <i className="fas fa-lock"></i> Pay ${total.toFixed(2)}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <i className="fas fa-shield-alt"></i> Payments are secure and encrypted
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
