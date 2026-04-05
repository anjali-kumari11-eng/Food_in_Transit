import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        let res;
        if (isLogin) {
            res = await login(formData.email, formData.password);
        } else {
            res = await register(formData.name, formData.email, formData.password);
        }

        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 68px)', padding: '24px' }}>
            <div className="card card-static" style={{ width: '100%', maxWidth: 420, padding: '40px 36px' }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'var(--primary-glow)', color: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', margin: '0 auto 16px'
                    }}>
                        <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 4 }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
                        {isLogin ? 'Login to order your favorite food' : 'Sign up to get started'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'var(--error-bg)', color: 'var(--error)',
                        padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                        marginBottom: 20, fontSize: '0.9rem', fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 8
                    }}>
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label"><i className="fas fa-user" style={{ marginRight: 6, color: 'var(--text-muted)' }}></i>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                required={!isLogin} className="form-input" placeholder="John Doe" />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label"><i className="fas fa-envelope" style={{ marginRight: 6, color: 'var(--text-muted)' }}></i>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            required className="form-input" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><i className="fas fa-lock" style={{ marginRight: 6, color: 'var(--text-muted)' }}></i>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                            required className="form-input" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '14px' }} disabled={loading}>
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                        ) : (
                            <>{isLogin ? 'Login' : 'Create Account'}</>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
