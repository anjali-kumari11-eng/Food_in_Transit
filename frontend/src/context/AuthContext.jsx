import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(res.data.data);
                } catch (err) {
                    console.error("Auth Error", err);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token, API_URL]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || err.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || err.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};
