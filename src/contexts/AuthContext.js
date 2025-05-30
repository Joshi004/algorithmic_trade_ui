import React, { createContext, useContext, useEffect, useState } from 'react';

import ENDPOINTS from '../services/endpoints';
import apiService from '../services/apiService';
import tokenManager from '../services/tokenManager';

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

  // Set up token manager callbacks
  useEffect(() => {
    tokenManager.setCallbacks(
      // onTokenExpired callback
      () => {
        console.log('AuthContext: Token expired, logging out user');
        setUser(null);
        setIsAuthenticated(false);
        tokenManager.stopTokenManagement();
      },
      // onTokenRefreshed callback  
      (tokenInfo) => {
        console.log('AuthContext: Token refreshed proactively', tokenInfo);
        // Token was refreshed successfully, user remains authenticated
        // No need to change isAuthenticated as it should already be true
      }
    );

    return () => {
      // Cleanup on unmount
      tokenManager.stopTokenManagement();
    };
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Conservative approach: Check if we have an active token
      if (tokenManager.isTokenExpired()) {
        console.log('AuthContext: No valid token found or token expired');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        // Check if we're on a public page (login, signup, landing)
        const publicPaths = ['/login', '/signup', '/'];
        const currentPath = window.location.pathname;
        
        if (publicPaths.includes(currentPath)) {
          // User is on a public page, start as unauthenticated
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // User is on a protected page and has a valid token
          // Set as authenticated and let API calls verify actual validity
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Even if we don't get user details, the login was successful
        setIsAuthenticated(true);
      }

      // Start proactive token management if token info is available
      if (response.token_info) {
        console.log('AuthContext: Starting token management after login');
        tokenManager.startTokenManagement(response.token_info);
      } else {
        console.warn('AuthContext: No token_info in login response');
      }
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      tokenManager.stopTokenManagement();
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
      tokenManager.stopTokenManagement();
      // Don't redirect here as apiService.logout() handles it
    }
  };

  const setAuthenticationFailed = () => {
    setUser(null);
    setIsAuthenticated(false);
    tokenManager.stopTokenManagement();
  };

  // Helper method to get token status
  const getTokenStatus = () => {
    return {
      isExpired: tokenManager.isTokenExpired(),
      timeUntilExpiry: tokenManager.getTimeUntilExpiry()
    };
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    setAuthenticationFailed,
    getTokenStatus // Add this for debugging/monitoring
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 