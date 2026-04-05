import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const emptyItem = {
    name: '', description: '', price: '', discount: 0,
    category: 'Main Course', isVeg: true, isAvailable: true,
    image: '', restaurant: ''
};

const AdminMenu = () => {
    const { token, API_URL } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyItem);
    const [filterRestaurant, setFilterRestaurant] = useState('');

    const fetchData = async () => {
        try {
            const [itemsRes, restRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/menu${filterRestaurant ? `?restaurant=${filterRestaurant}` : ''}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/admin/restaurants`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setItems(itemsRes.data.data);
            setRestaurants(restRes.data.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [token, API_URL, filterRestaurant]);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...emptyItem, restaurant: filterRestaurant || (restaurants[0]?._id || '') });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item._id);
        setForm({
            ...item,
            restaurant: item.restaurant?._id || item.restaurant
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: Number(form.price),
            discount: Number(form.discount)
        };

        try {
            if (editing) {
                await axios.put(`${API_URL}/api/admin/menu/${editing}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/api/admin/menu`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this menu item?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(items.filter(i => i._id !== id));
        } catch (err) {
            alert('Error deleting item');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            await axios.put(`${API_URL}/api/admin/menu/${item._id}`, { isAvailable: !item.isAvailable }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Error toggling availability');
        }
    };

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

    const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Breads', 'Sides'];

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h2>Manage Menu Items</h2>
                <p>{items.length} items{filterRestaurant ? ' for selected restaurant' : ' across all restaurants'}</p>
            </header>

            <div className="admin-toolbar">
                <select
                    className="form-input"
                    style={{ maxWidth: 280 }}
                    value={filterRestaurant}
                    onChange={(e) => setFilterRestaurant(e.target.value)}
                >
                    <option value="">All Restaurants</option>
                    {restaurants.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>
                <button className="btn-primary" onClick={openAdd}>
                    <i className="fas fa-plus"></i> Add Item
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h2>
                            <i className="fas fa-hamburger" style={{ color: 'var(--primary)' }}></i>
                            {editing ? 'Edit Menu Item' : 'Add Menu Item'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Restaurant *</label>
                                <select name="restaurant" value={form.restaurant} onChange={handleChange} required className="form-input">
                                    <option value="">Select restaurant</option>
                                    {restaurants.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Item Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="e.g. Margherita Pizza" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required className="form-input" rows="2" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price ($) *</label>
                                    <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Discount (%)</label>
                                    <input type="number" min="0" max="100" name="discount" value={form.discount} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select name="category" value={form.category} onChange={handleChange} className="form-input">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input name="image" value={form.image} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                            <div className="flex items-center gap-lg" style={{ marginTop: 8 }}>
                                <div className="toggle-wrap">
                                    <span className="form-label" style={{ marginBottom: 0 }}>Vegetarian</span>
                                    <div className={`toggle ${form.isVeg ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, isVeg: !p.isVeg }))}></div>
                                </div>
                                <div className="toggle-wrap">
                                    <span className="form-label" style={{ marginBottom: 0 }}>Available</span>
                                    <div className={`toggle ${form.isAvailable ? 'active' : ''}`} onClick={() => setForm(p => ({ ...p, isAvailable: !p.isAvailable }))}></div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary btn-sm">
                                    <i className={`fas ${editing ? 'fa-save' : 'fa-plus'}`}></i> {editing ? 'Save' : 'Create'}
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
                            <th>Restaurant</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Type</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} style={{ opacity: item.isAvailable ? 1 : 0.5 }}>
                                <td>
                                    <img src={item.image} alt={item.name} className="admin-table-img" />
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    {item.discount > 0 && (
                                        <span className="discount-tag" style={{ marginTop: 4 }}>{item.discount}% OFF</span>
                                    )}
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {item.restaurant?.name || 'N/A'}
                                </td>
                                <td>
                                    <span className="badge badge-info">{item.category}</span>
                                </td>
                                <td>
                                    <span style={{ fontWeight: 700 }}>
                                        {item.discount > 0 && <span className="price-original">${item.price.toFixed(2)}</span>}
                                        ${(item.price - item.price * item.discount / 100).toFixed(2)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                                    </span>
                                </td>
                                <td>
                                    <div className={`toggle ${item.isAvailable ? 'active' : ''}`} onClick={() => toggleAvailability(item)} style={{ cursor: 'pointer' }}></div>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="btn-action edit" onClick={() => openEdit(item)} title="Edit">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button className="btn-action delete" onClick={() => handleDelete(item._id)} title="Delete">
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

export default AdminMenu;
