import { Box, Chip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

const TokenStatus = ({ show = false, compact = false }) => {
  const { getTokenStatus, isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState({ isExpired: true, timeUntilExpiry: 0 });

  useEffect(() => {
    if (!show || !isAuthenticated) return;

    const updateStatus = () => {
      setTokenStatus(getTokenStatus());
    };

    // Update immediately
    updateStatus();

    // Update every second
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [show, isAuthenticated, getTokenStatus]);

  if (!show || !isAuthenticated) {
    return null;
  }

  const formatTime = (seconds) => {
    if (seconds <= 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  // Compact version for header
  if (compact) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          px: 2,
          py: 0.5,
          borderRadius: '20px',
          bgcolor: tokenStatus.isExpired 
            ? 'rgba(244, 67, 54, 0.1)' 
            : tokenStatus.timeUntilExpiry < 10 
              ? 'rgba(255, 152, 0, 0.1)' 
              : 'rgba(76, 175, 80, 0.1)',
          border: `1px solid ${
            tokenStatus.isExpired 
              ? 'rgba(244, 67, 54, 0.3)' 
              : tokenStatus.timeUntilExpiry < 10 
                ? 'rgba(255, 152, 0, 0.3)' 
                : 'rgba(76, 175, 80, 0.3)'
          }`
        }}
      >
        <Chip 
          label="SLT" 
          size="small"
          color={tokenStatus.isExpired ? 'error' : tokenStatus.timeUntilExpiry < 10 ? 'warning' : 'success'}
          sx={{ 
            fontSize: '0.75rem', 
            height: '20px',
            '& .MuiChip-label': { px: 1 }
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: tokenStatus.isExpired 
              ? 'error.main' 
              : tokenStatus.timeUntilExpiry < 10 
                ? 'warning.main' 
                : 'success.main'
          }}
        >
          {formatTime(tokenStatus.timeUntilExpiry)}
        </Typography>
      </Box>
    );
  }

  // Full version (original)
  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        minWidth: 200,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        p: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
        Token Status
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Status:</Typography>
          <Chip 
            label={tokenStatus.isExpired ? 'Expired' : 'Valid'} 
            color={tokenStatus.isExpired ? 'error' : 'success'}
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Time left:</Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 'bold',
              color: tokenStatus.timeUntilExpiry < 60 ? 'error.main' : 'text.primary'
            }}
          >
            {formatTime(tokenStatus.timeUntilExpiry)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Auth State:</Typography>
          <Chip 
            label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'} 
            color={isAuthenticated ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TokenStatus; 