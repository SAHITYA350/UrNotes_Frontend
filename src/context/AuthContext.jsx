import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    };

    const register = async (username, email, password) => {
        const response = await axios.post(`${API_URL}/api/users/register`, { username, email, password });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    };

    const updateProfile = async (formData) => {
        const response = await axios.put(`${API_URL}/api/users/profile`, formData, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
