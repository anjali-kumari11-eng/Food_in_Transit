import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminUsers = () => {
    const { token, API_URL } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data.data);
            } catch (err) {
                console.error("Error fetching users", err);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [token, API_URL]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            alert('Error deleting user');
        }
    };

    if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <h2>Manage Users</h2>
                <p>{users.length} registered users on the platform</p>
            </header>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="flex items-center gap-sm">
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: u.role === 'admin' ? 'var(--error-bg)' : 'var(--info-bg)',
                                            color: u.role === 'admin' ? 'var(--error)' : 'var(--info)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
                                        }}>
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-light)' }}>{u.email}</td>
                                <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                <td style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        {u.role !== 'admin' && (
                                            <button className="btn-action delete" onClick={() => handleDelete(u._id)} title="Delete">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
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

export default AdminUsers;
