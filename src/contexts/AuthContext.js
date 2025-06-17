import React, { createContext, useContext, useEffect, useState } from 'react';

import ENDPOINTS from '../services/endpoints';
import apiService from '../services/apiService';
import tokenManager from '../services/tokenManager';
import websocketService from '../services/websocketService';

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

  // Set up token manager callbacks
  useEffect(() => {
    tokenManager.setCallbacks(
      // onTokenExpired callback
      () => {
        console.log('AuthContext: Token expired, logging out user');
        setUser(null);
        sessionStorage.removeItem('user');
        tokenManager.stopTokenManagement();
        websocketService.disconnect();
      },
      // onTokenRefreshed callback  
      (tokenInfo) => {
        console.log('AuthContext: Token refreshed proactively', tokenInfo);
        // Token was refreshed successfully, session storage is updated automatically
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
      // Check session storage for authentication status and user data
      console.log('AuthContext: Checking authentication status from session storage');
      
      // Restore user data from session storage if available
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Restored user data from session storage:', userData);
          setUser(userData);
        } catch (parseError) {
          console.error('AuthContext: Failed to parse stored user data:', parseError);
          sessionStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get current authentication status from session storage
  const isAuthenticated = () => {
    return tokenManager.isAuthenticated();
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        // Save user data to session storage for persistence across page refreshes
        sessionStorage.setItem('user', JSON.stringify(response.user));
        console.log('AuthContext: Saved user data to session storage:', response.user);
      }

      // Start proactive token management if token info is available
      if (response.token_info) {
        console.log('AuthContext: Starting token management after login');
        tokenManager.startTokenManagement(response.token_info);
      } else {
        console.warn('AuthContext: No token_info in login response');
      }

      // Establish WebSocket connection after successful login
      // Wait briefly to ensure cookies are set before connecting
      setTimeout(() => {
        console.log('AuthContext: Establishing WebSocket connection after login');
        websocketService.connect();
      }, 100);
      
      return response;
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem('user');
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
      sessionStorage.removeItem('user');
      tokenManager.stopTokenManagement();
      // Disconnect WebSocket on logout
      websocketService.disconnect();
      // Don't redirect here as apiService.logout() handles it
    }
  };

  const setAuthenticationFailed = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    tokenManager.stopTokenManagement();
    websocketService.disconnect();
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
    isAuthenticated, // This is now a function that checks session storage
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    setAuthenticationFailed,
    getTokenStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 