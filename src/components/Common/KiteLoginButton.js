import { Box, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import kiteService from '../../services/kiteService';
import toastService from '../../services/toastService';
import { useNavigate } from 'react-router-dom';

const KiteLoginButton = ({ 
  variant = 'contained', 
  size = 'medium', 
  fullWidth = false,
  children = 'Connect to Zerodha',
  onInitiate = null,
  ...props 
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKiteLogin = async () => {
    setLoading(true);
    toastService.dismissAll();

    try {
      const result = await kiteService.initiateKiteLogin();
      
      if (!result.success) {
        if (result.error === 'NO_BROKER_CREDENTIALS') {
          toastService.warning('Please register your broker credentials first. Redirecting...', 'Broker Credentials Required', 3000);
          // Brief delay before redirect
          setTimeout(() => {
            navigate('/broker-registration');
          }, 2000);
          return;
        }
        
        // Show other errors
        toastService.error(result.message || 'Failed to initiate Kite login', 'Kite Login Failed');
      } else {
        toastService.info('Taking you to Zerodha login page...', 'Redirecting to Zerodha', 3000);
        
        // Call the onInitiate callback if provided
        if (onInitiate && typeof onInitiate === 'function') {
          onInitiate();
        }
      }
      
      // If successful, the user will be redirected to Kite login
      // No need to do anything here as the redirect happens in the service
      
    } catch (err) {
      console.error('Kite login error:', err);
      toastService.error(err.message || 'An unexpected error occurred', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleKiteLogin}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          children
        )}
      </Button>
    </Box>
  );
};

export default KiteLoginButton; 