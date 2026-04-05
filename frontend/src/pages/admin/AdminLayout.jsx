import React, { useContext } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './admin.css';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2><i className="fas fa-shield-alt"></i> Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-chart-pie"></i> Overview
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-users"></i> Users
                    </NavLink>
                    <NavLink to="/admin/restaurants" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-store"></i> Restaurants
                    </NavLink>
                    <NavLink to="/admin/menu" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-hamburger"></i> Menu Items
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-receipt"></i> Orders
                    </NavLink>
                </nav>
            </aside>
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
