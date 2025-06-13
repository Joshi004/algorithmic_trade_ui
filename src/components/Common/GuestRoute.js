import { Box, CircularProgress } from '@mui/material';

import { Navigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GuestRoute = ({ children, redirectTo = '/home' }) => {
  const { isAuthenticated, loading } = useAuth();

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

  // If authenticated, redirect to home (or specified route)
  // This prevents authenticated users from accessing login/signup pages
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, render the guest component
  return children;
};

export default GuestRoute; 