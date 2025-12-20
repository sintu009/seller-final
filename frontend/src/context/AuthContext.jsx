import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getStoredToken = () => localStorage.getItem('token');
const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(data.message || 'Login failed');
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signup = async (email, password, name, role) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        const userData = data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Account created successfully!');
        return { success: true };
      } else {
        toast.error(data.message || 'Registration failed');
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
