import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

/**
 * Custom hook for authentication guard functionality
 * @param {boolean} requireAuth - Whether authentication is required
 * @param {string} redirectTo - Where to redirect if auth requirement is not met
 * @returns {object} - Auth status and utility functions
 */
export const useAuthGuard = (requireAuth = true, redirectTo = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current authentication status
  const currentAuthStatus = isAuthenticated();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !currentAuthStatus) {
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
    }

    // If authentication is not allowed (e.g., login page) but user is authenticated
    if (!requireAuth && currentAuthStatus && redirectTo !== '/login') {
      navigate(redirectTo, { replace: true });
    }
  }, [currentAuthStatus, loading, requireAuth, redirectTo, navigate, location]);

  return {
    isAuthenticated: currentAuthStatus,
    loading,
    canAccess: loading ? null : requireAuth ? currentAuthStatus : !currentAuthStatus
  };
};

/**
 * Hook specifically for protected routes
 */
export const useProtectedRoute = () => {
  return useAuthGuard(true, '/login');
};

/**
 * Hook specifically for guest-only routes (like login/signup)
 */
export const useGuestRoute = () => {
  return useAuthGuard(false, '/home');
}; 