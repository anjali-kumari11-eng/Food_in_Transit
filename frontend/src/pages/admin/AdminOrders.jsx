import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminOrders = () => {
    const { token, API_URL } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data.data);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [token, API_URL]);

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h2>Manage Orders</h2>
                <p>{orders.length} orders placed on the platform</p>
            </header>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Restaurant</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o._id}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                                    #{o._id.substring(o._id.length - 6).toUpperCase()}
                                </td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{o.user ? o.user.name : 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{o.user?.email || ''}</div>
                                </td>
                                <td>{o.restaurant ? o.restaurant.name : 'Unknown'}</td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                                </td>
                                <td style={{ fontWeight: 700 }}>${o.totalAmount.toFixed(2)}</td>
                                <td>
                                    <span className={`status-badge-admin ${o.status.toLowerCase()}`}>
                                        {o.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                                    {new Date(o.createdAt || o.orderedAt).toLocaleDateString()}<br />
                                    <span style={{ fontSize: '0.75rem' }}>{new Date(o.createdAt || o.orderedAt).toLocaleTimeString()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
