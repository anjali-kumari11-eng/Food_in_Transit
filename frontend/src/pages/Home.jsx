import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCuisine, setActiveCuisine] = useState('All');
    const { API_URL } = useContext(AuthContext);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/restaurants`);
                setRestaurants(res.data.data);
            } catch (err) {
                console.error('Error fetching restaurants', err);
            }
            setLoading(false);
        };
        fetchRestaurants();
    }, [API_URL]);

    const isOpen = (openTime, closeTime) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentMinutes = hours * 60 + minutes;

        const [openH, openM] = openTime.split(':').map(Number);
        const [closeH, closeM] = closeTime.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        if (closeMinutes <= openMinutes) {
            return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
        }
        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    };

    // Get unique cuisines
    const allCuisines = ['All', ...new Set(restaurants.flatMap(r => r.cuisines))];

    // Filter restaurants
    const filtered = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisines.some(c => c.toLowerCase().includes(search.toLowerCase()));
        const matchesCuisine = activeCuisine === 'All' || r.cuisines.includes(activeCuisine);
        return matchesSearch && matchesCuisine;
    });

    if (loading) return <div className="loader"></div>;

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content container">
                    <h1>Delicious food,<br /><span>delivered fast.</span></h1>
                    <p>Order from the best restaurants near you. Fresh, hot, and at your doorstep in minutes.</p>

                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search restaurants or cuisines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-chips">
                        {allCuisines.slice(0, 10).map(cuisine => (
                            <button
                                key={cuisine}
                                className={`chip ${activeCuisine === cuisine ? 'chip-active' : ''}`}
                                onClick={() => setActiveCuisine(cuisine)}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Restaurant Grid */}
            <section className="container">
                <div style={{ padding: '32px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>
                        {activeCuisine === 'All' ? 'All Restaurants' : activeCuisine} 
                        <span style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: '1rem', marginLeft: 8 }}>
                            ({filtered.length})
                        </span>
                    </h2>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <h2>No restaurants found</h2>
                        <p>Try a different search or cuisine filter</p>
                        <button className="btn-primary" onClick={() => { setSearch(''); setActiveCuisine('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="restaurant-grid">
                        {filtered.map(rest => {
                            const open = isOpen(rest.openTime || '09:00', rest.closeTime || '23:00');
                            return (
                                <Link to={`/restaurant/${rest._id}`} key={rest._id} className="restaurant-card fade-in">
                                    <div className="restaurant-card-img-wrapper">
                                        <img
                                            src={rest.image}
                                            alt={rest.name}
                                            className="restaurant-card-img"
                                        />
                                        <div className="restaurant-card-badges">
                                            {rest.featured && <span className="featured-badge"><i className="fas fa-crown"></i> Featured</span>}
                                            <span className={`open-badge ${open ? 'open' : 'closed'}`}>
                                                {open ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                        <span className="restaurant-card-time">
                                            <i className="fas fa-clock"></i> {rest.deliveryTime}
                                        </span>
                                    </div>
                                    <div className="restaurant-card-body">
                                        <div className="restaurant-card-title">
                                            <span>{rest.name}</span>
                                            <span className="restaurant-card-rating">
                                                <i className="fas fa-star"></i> {rest.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="restaurant-card-cuisines">{rest.cuisines.join(' • ')}</div>
                                        <div className="restaurant-card-footer">
                                            <span><i className="fas fa-map-marker-alt"></i> {rest.address?.city || 'New York'}</span>
                                            <span>
                                                {rest.deliveryFee === 0 ? (
                                                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free Delivery</span>
                                                ) : (
                                                    <>Delivery: ${rest.deliveryFee?.toFixed(2) || '2.99'}</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div>
                            <div className="footer-brand"><i className="fas fa-motorcycle"></i> FoodInTransit</div>
                            <p style={{ maxWidth: 280, fontSize: '0.9rem' }}>Delivering happiness to your doorstep. Fast, fresh, and reliable.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <a href="#">About Us</a>
                            <a href="#">Careers</a>
                            <a href="#">Blog</a>
                        </div>
                        <div className="footer-links">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">Safety</a>
                            <a href="#">Contact</a>
                        </div>
                        <div className="footer-links">
                            <h4>Legal</h4>
                            <a href="#">Terms</a>
                            <a href="#">Privacy</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        &copy; {new Date().getFullYear()} FoodInTransit. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
