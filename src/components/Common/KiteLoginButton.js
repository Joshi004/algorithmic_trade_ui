import { Backdrop, Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';

import brokerService from '../../services/brokerService';
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleKiteLogin = async () => {
    setLoading(true);
    setIsConnecting(true);
    toastService.dismissAll();

    try {
      const result = await brokerService.initiateKiteLogin();
      
      if (!result.success) {
        if (result.error === 'NO_BROKER_CREDENTIALS') {
          toastService.warning('Please register your broker credentials first. Redirecting...', 'Broker Credentials Required', 3000);
          
          // Set navigation loading state
          setLoading(false);
          setIsConnecting(false);
          setIsNavigating(true);
          
          // Brief delay before redirect
          setTimeout(() => {
            navigate('/broker-registration');
            setIsNavigating(false);
          }, 2000);
          return;
        }
        
        // Show other errors
        toastService.error(result.message || 'Failed to initiate Kite login', 'Kite Login Failed');
        setLoading(false);
        setIsConnecting(false);
      } else {
        // API succeeded, show connecting state briefly then redirect
        toastService.info('Taking you to Zerodha login page...', 'Redirecting to Zerodha', 3000);
        
        // Call the onInitiate callback if provided
        if (onInitiate && typeof onInitiate === 'function') {
          onInitiate();
        }
        
        // Show connecting state for 1 second before the redirect completes
        setTimeout(() => {
          setLoading(false);
          setIsConnecting(false);
          // The redirect happens in the brokerService.initiateKiteLogin and user will leave the page
        }, 1000);
      }
      
    } catch (err) {
      console.error('Kite login error:', err);
      toastService.error(err.message || 'An unexpected error occurred', 'Connection Error');
      setLoading(false);
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleKiteLogin}
        disabled={loading || isNavigating || isConnecting}
        {...props}
      >
        {loading || isNavigating || isConnecting ? (
          <Box display="flex" alignItems="center">
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            {isConnecting ? 'Connecting...' : isNavigating ? 'Redirecting...' : 'Connecting...'}
          </Box>
        ) : (
          children
        )}
      </Button>

      {/* Full Page Loading Overlay for Connection */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isConnecting}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" color="inherit">
          Connecting to Zerodha
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
          Please wait while we establish connection...
        </Typography>
      </Backdrop>

      {/* Full Page Loading Overlay for Navigation */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isNavigating}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" color="inherit">
          Broker Credentials Required
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
          Redirecting you to broker registration...
        </Typography>
      </Backdrop>
    </>
  );
};

export default KiteLoginButton; 