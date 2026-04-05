import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">
                    <i className="fas fa-motorcycle"></i> FoodInTransit
                </Link>
                <div className="nav-links">
                    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                        <i className="fas fa-home"></i> <span>Home</span>
                    </NavLink>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                                    <i className="fas fa-shield-alt"></i> <span>Admin</span>
                                </NavLink>
                            )}
                            <NavLink to="/checkout" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} style={{ position: 'relative' }}>
                                <i className="fas fa-shopping-bag"></i> <span>Cart</span>
                                {getCartCount() > 0 && (
                                    <span className="nav-cart-badge">{getCartCount()}</span>
                                )}
                            </NavLink>
                            <div className="nav-user">
                                <span className="nav-user-name">{user.name}</span>
                                <div className="nav-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                            </div>
                            <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--text-light)' }}>
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary btn-sm">
                            <i className="fas fa-user"></i> Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
