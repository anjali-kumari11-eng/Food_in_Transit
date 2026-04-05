import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminOverview = () => {
    const { token, API_URL } = useContext(AuthContext);
    const [stats, setStats] = useState({ users: 0, restaurants: 0, orders: 0, menuItems: 0, revenue: 0, recentOrders: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.data);
            } catch (err) {
                console.error("Error fetching stats", err);
            }
            setLoading(false);
        };
        fetchStats();
    }, [token, API_URL]);

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening with your platform.</p>
            </header>

            <div className="admin-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue"><i className="fas fa-users"></i></div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p>{stats.users}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><i className="fas fa-store"></i></div>
                    <div className="stat-info">
                        <h3>Restaurants</h3>
                        <p>{stats.restaurants}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><i className="fas fa-hamburger"></i></div>
                    <div className="stat-info">
                        <h3>Menu Items</h3>
                        <p>{stats.menuItems}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red"><i className="fas fa-receipt"></i></div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p>{stats.orders}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><i className="fas fa-dollar-sign"></i></div>
                    <div className="stat-info">
                        <h3>Revenue</h3>
                        <p>${stats.revenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            {stats.recentOrders && stats.recentOrders.length > 0 && (
                <>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>
                        <i className="fas fa-clock" style={{ color: 'var(--primary)', marginRight: 8 }}></i>
                        Recent Orders
                    </h2>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Restaurant</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(o => (
                                    <tr key={o._id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>#{o._id.substring(o._id.length - 6).toUpperCase()}</td>
                                        <td>{o.user ? o.user.name : 'Unknown'}</td>
                                        <td>{o.restaurant ? o.restaurant.name : 'Unknown'}</td>
                                        <td style={{ fontWeight: 600 }}>${o.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge-admin ${o.status.toLowerCase()}`}>
                                                {o.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOverview;
