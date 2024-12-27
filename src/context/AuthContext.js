import React, { createContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      history.push('/'); // Redirect to homepage if no token
    }
  }, [token, history]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/user');
      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      if (err.response && err.response.status === 401) {
        console.error("Session expired or user not authenticated");
        history.push('/'); // Redirect to homepage
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/'); // Redirect to homepage if not authenticated
    } else if (user) {
      if (user.role === 'club') {
        if (location.pathname === '/search-players' || location.pathname === '/saved-players') {
          history.push('/clubProfile');
        }
      } else if (user.role === 'player') {
        history.push('/playerProfile');
      }
    }
  }, [isAuthenticated, user, history, location]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, role: user.role };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
      history.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      
      if (response.data.isAuthenticated) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        return { 
          success: true, 
          user: response.data.user 
        };
      }
      
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
