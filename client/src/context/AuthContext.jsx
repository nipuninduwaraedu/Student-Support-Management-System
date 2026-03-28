import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate user based on token if they refresh the page
  useEffect(() => {
    if (token) {
      // Decode user from local storage info
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setUser(userInfo);
      }
    }
    setLoading(false);
  }, [token]);

  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
