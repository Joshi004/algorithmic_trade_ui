import React, { createContext, useContext, useEffect, useState } from 'react';

import ENDPOINTS from '../services/endpoints';
import apiService from '../services/apiService';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simple check - just see if we can access document.cookie
      // Since we're using HTTP-only cookies, we can't actually read them
      // But we can assume if we're not being redirected, we might be authenticated
      // For now, we'll just set loading to false and let the actual API calls handle auth
      
      // Don't make any API calls here to avoid infinite loops
      // The actual authentication will be handled by individual API calls
      setIsAuthenticated(false); // Start as not authenticated
      setLoading(false);
    } catch (error) {
      console.log('Auth check failed:', error.message);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, userData);
      
      // Registration successful, but user still needs to login
      // Don't set authenticated state here
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 