import { Alert, Box, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import kiteService from '../../services/kiteService';
import { useNavigate } from 'react-router-dom';

const KiteLoginButton = ({ 
  variant = 'contained', 
  size = 'medium', 
  fullWidth = false,
  children = 'Connect to Zerodha',
  ...props 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsBrokerSetup, setNeedsBrokerSetup] = useState(false);
  const navigate = useNavigate();

  const handleKiteLogin = async () => {
    setLoading(true);
    setError('');
    setNeedsBrokerSetup(false);

    try {
      const result = await kiteService.initiateKiteLogin();
      
      if (!result.success) {
        if (result.error === 'NO_BROKER_CREDENTIALS') {
          // Show broker setup message instead of immediate redirect
          setNeedsBrokerSetup(true);
          setError('You need to register your broker credentials first to connect to Zerodha.');
          return;
        }
        
        // Show other errors
        setError(result.message || 'Failed to initiate Kite login');
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

  const handleRegisterBroker = () => {
    navigate('/broker-registration');
  };

  return (
    <Box>
      {error && (
        <Alert 
          severity={needsBrokerSetup ? "info" : "error"} 
          sx={{ mb: 2 }}
          action={needsBrokerSetup && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRegisterBroker}
              sx={{ textTransform: 'none' }}
            >
              Register Broker
            </Button>
          )}
        >
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