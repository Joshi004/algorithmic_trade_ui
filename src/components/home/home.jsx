import { Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';

import AuthenticatedDashboard from './AuthenticatedDashboard';
import LandingPage from './LandingPage';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Log state changes for debugging
  useEffect(() => {
    console.log(`Home component - Auth state: ${isAuthenticated}, Loading: ${loading}, Path: ${location.pathname}`);
  }, [isAuthenticated, loading, location.pathname]);

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
  if (isAuthenticated) {
    return <AuthenticatedDashboard />;
  } else {
    return <LandingPage />;
  }
};

export default Home;
