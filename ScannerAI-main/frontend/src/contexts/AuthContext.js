import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log('Fetching user with token:', token);
      const response = await api.get('/auth/me');
      console.log('User data received:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      console.log('Error details:', error.response?.data);
      // Don't logout immediately, let the user try to login again
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await api.post('/auth/login', { email });
      console.log('Login response:', response.data);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.log('Error response:', error.response?.data);
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email) => {
    try {
      console.log('Attempting registration with email:', email);
      const response = await api.post('/auth/register', { email });
      console.log('Registration response:', response.data);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.log('Error response:', error.response?.data);
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


