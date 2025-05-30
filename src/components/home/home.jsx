import { Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';

import AuthenticatedDashboard from './AuthenticatedDashboard';
import LandingPage from './LandingPage';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Get current authentication status
  const currentAuthStatus = isAuthenticated();

  // Log state changes for debugging
  useEffect(() => {
    console.log(`Home component - Auth state: ${currentAuthStatus}, Loading: ${loading}, Path: ${location.pathname}`);
  }, [currentAuthStatus, loading, location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show different components based on authentication status
  console.log('Authentication Status ', currentAuthStatus);
  if (currentAuthStatus) {
    console.log('Home: Showing AuthenticatedDashboard');
    return <AuthenticatedDashboard />;
  } else {
    console.log('Home: Showing LandingPage');
    return <LandingPage />;
  }
};

export default Home;
