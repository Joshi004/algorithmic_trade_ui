import { Alert, Box, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import kiteService from '../../services/kiteService';
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleKiteLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await kiteService.initiateKiteLogin();
      
      if (!result.success) {
        if (result.error === 'NO_BROKER_CREDENTIALS') {
          // Redirect to broker registration
          navigate('/broker-registration');
          return;
        }
        
        // Show other errors
        setError(result.message || 'Failed to initiate Kite login');
      } else {
        // Call the onInitiate callback if provided
        if (onInitiate && typeof onInitiate === 'function') {
          onInitiate();
        }
      }
      
      // If successful, the user will be redirected to Kite login
      // No need to do anything here as the redirect happens in the service
      
    } catch (err) {
      console.error('Kite login error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
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