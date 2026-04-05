import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const emptyRestaurant = {
    name: '', description: '', cuisines: '',
    address: { street: '', city: '', state: '', zipcode: '' },
    phone: '', openTime: '09:00', closeTime: '23:00',
    deliveryTime: '30 mins', deliveryFee: 2.99,
    image: '', rating: 4.0, featured: false, isActive: true
};

const AdminRestaurants = () => {
    const { token, API_URL } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyRestaurant);

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/restaurants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRestaurants(res.data.data);
        } catch (err) {
            console.error("Error fetching restaurants", err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchRestaurants(); }, [token, API_URL]);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyRestaurant);
        setShowModal(true);
    };

    const openEdit = (r) => {
        setEditing(r._id);
        setForm({
            ...r,
            cuisines: Array.isArray(r.cuisines) ? r.cuisines.join(', ') : r.cuisines,
            address: r.address || { street: '', city: '', state: '', zipcode: '' }
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const key = name.split('.')[1];
            setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            cuisines: typeof form.cuisines === 'string' ? form.cuisines.split(',').map(c => c.trim()) : form.cuisines,
            deliveryFee: Number(form.deliveryFee),
            rating: Number(form.rating)
        };

        try {
            if (editing) {
                await axios.put(`${API_URL}/api/admin/restaurants/${editing}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/api/admin/restaurants`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchRestaurants();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this restaurant and all its menu items?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/restaurants/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRestaurants(restaurants.filter(r => r._id !== id));
        } catch (err) {
            alert('Error deleting restaurant');
        }
    };

    const toggleActive = async (r) => {
        try {
            await axios.put(`${API_URL}/api/admin/restaurants/${r._id}`, { isActive: !r.isActive }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRestaurants();
        } catch (err) {
            alert('Error toggling status');
        }
    };

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h2>Manage Restaurants</h2>
                <p>{restaurants.length} restaurants on the platform</p>
            </header>

            <div className="admin-toolbar">
                <div></div>
                <button className="btn-primary" onClick={openAdd}>
                    <i className="fas fa-plus"></i> Add Restaurant
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h2>
                            <i className="fas fa-store" style={{ color: 'var(--primary)' }}></i>
                            {editing ? 'Edit Restaurant' : 'Add Restaurant'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Restaurant Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="e.g. Pizza Palace" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required className="form-input" rows="2" placeholder="Brief description..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cuisines (comma-separated) *</label>
                                <input name="cuisines" value={form.cuisines} onChange={handleChange} required className="form-input" placeholder="Italian, Pizza, Fast Food" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Street</label>
                                    <input name="address.street" value={form.address.street} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input name="address.city" value={form.address.city} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Open Time</label>
                                    <input type="time" name="openTime" value={form.openTime} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Close Time</label>
                                    <input type="time" name="closeTime" value={form.closeTime} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Delivery Time</label>
                                    <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} className="form-input" placeholder="30 mins" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Delivery Fee ($)</label>
                                    <input type="number" step="0.01" name="deliveryFee" value={form.deliveryFee} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input name="image" value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <input type="number" step="0.1" min="1" max="5" name="rating" value={form.rating} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="flex items-center gap-lg" style={{ marginTop: 8 }}>
                                <div className="toggle-wrap">
                                    <span className="form-label" style={{ marginBottom: 0 }}>Active</span>
                                    <div className={`toggle ${form.isActive ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}></div>
                                </div>
                                <div className="toggle-wrap">
                                    <span className="form-label" style={{ marginBottom: 0 }}>Featured</span>
                                    <div className={`toggle ${form.featured ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}></div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary btn-sm">
                                    <i className={`fas ${editing ? 'fa-save' : 'fa-plus'}`}></i> {editing ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Cuisines</th>
                            <th>Hours</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map(r => (
                            <tr key={r._id}>
                                <td>
                                    <img src={r.image} alt={r.name} className="admin-table-img" />
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                        {r.address?.city || 'N/A'}
                                    </div>
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {r.cuisines.join(', ')}
                                </td>
                                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                    {r.openTime} — {r.closeTime}
                                </td>
                                <td>
                                    <span style={{ fontWeight: 700 }}>
                                        <i className="fas fa-star" style={{ color: '#facc15', marginRight: 3 }}></i>
                                        {r.rating.toFixed(1)}
                                    </span>
                                </td>
                                <td>
                                    <div className={`toggle ${r.isActive ? 'active' : ''}`} onClick={() => toggleActive(r)} style={{ cursor: 'pointer' }}></div>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="btn-action edit" onClick={() => openEdit(r)} title="Edit">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button className="btn-action delete" onClick={() => handleDelete(r._id)} title="Delete">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRestaurants;
