import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const OrderTracking = () => {
    const { id } = useParams();
    const { token, API_URL } = useContext(AuthContext);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveStatus, setLiveStatus] = useState(null);

    const statusSteps = ['Pending', 'Preparing', 'Picked', 'Out_for_delivery', 'Delivered'];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data.data);
                setLiveStatus(res.data.data.status);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        if (token) fetchOrder();

        // Socket.io connection setup
        const socket = io(API_URL);

        socket.on('connect', () => {
            socket.emit('joinRoom', id);
        });

        socket.on('orderStatusUpdate', (data) => {
            console.log('Update received:', data);
            setLiveStatus(data.status);
        });

        return () => {
            socket.disconnect();
        };
    }, [id, token, API_URL]);

    if (loading) return <div className="loader"></div>;
    if (!order) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Order not found</div>;

    const currentStepIndex = statusSteps.indexOf(liveStatus);

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
            <div className="card" style={{ padding: '40px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '40px' }}>
                    From {order.restaurant?.name || 'Restaurant'}
                </p>

                {/* Progress Tracker UI */}
                <div style={{ position: 'relative', marginBottom: '60px', padding: '0 20px' }}>
                    <div style={{ 
                        position: 'absolute', top: '15px', left: '40px', right: '40px', 
                        height: '4px', background: 'var(--border)', zIndex: 0 
                    }}>
                        <div style={{
                            height: '100%', 
                            background: 'var(--primary)',
                            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                            transition: 'width 0.5s ease-in-out'
                        }}></div>
                    </div>

                    <div className="flex justify-between" style={{ position: 'relative', zIndex: 1 }}>
                        {statusSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isActive = index === currentStepIndex;
                            return (
                                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isCompleted ? 'var(--primary)' : 'var(--surface)',
                                        color: isCompleted ? 'white' : 'var(--text-light)',
                                        border: `2px solid ${isCompleted ? 'var(--primary)' : 'var(--border)'}`,
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s',
                                        boxShadow: isActive ? '0 0 0 4px rgba(255, 75, 43, 0.2)' : 'none'
                                    }}>
                                        {isActive && step !== 'Delivered' ? <span style={{fontSize: '12px'}}>⏳</span> : (isCompleted ? '✓' : index + 1)}
                                    </div>
                                    <span style={{ 
                                        marginTop: '12px', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500,
                                        color: isCompleted ? 'var(--text-main)' : 'var(--text-light)'
                                    }}>
                                        {step.replace('_', ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Live Delivery Details */}
                <div style={{ background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🔴 Live Status: <span style={{ color: 'var(--primary)' }}>{liveStatus.replace('_', ' ')}</span>
                    </h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        {liveStatus === 'Pending' && "Waiting for restaurant to confirm your order."}
                        {liveStatus === 'Preparing' && "Your food is being prepared with care."}
                        {liveStatus === 'Picked' && "Delivery partner has picked up your order."}
                        {liveStatus === 'Out_for_delivery' && "Your food is on the way!"}
                        {liveStatus === 'Delivered' && "Order delivered. Enjoy your meal!"}
                    </p>
                </div>

                {/* Order Details Footer */}
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <h4 style={{ marginBottom: '8px', color: 'var(--text-light)' }}>Delivery Address</h4>
                        <p>{order.deliveryAddress.street}</p>
                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
                    </div>
                    <div>
                         <h4 style={{ marginBottom: '8px', color: 'var(--text-light)' }}>Items</h4>
                         {order.items.map(item => (
                             <div key={item._id} className="flex justify-between" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                 <span>{item.quantity}x {item.name}</span>
                             </div>
                         ))}
                         <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
                             Total: ${order.totalAmount.toFixed(2)}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
