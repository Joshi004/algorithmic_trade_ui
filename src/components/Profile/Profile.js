import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Stack } from '@mui/material';

// Components
import UserSummaryCard from './UserSummaryCard';
import AccountDetailsCard from './AccountDetailsCard';
import TradingCapabilitiesCard from './TradingCapabilitiesCard';
import BrokerConnectionCard from './BrokerConnectionCard';
import LoadingBackdrop from '../Common/LoadingBackdrop';

// Services
import brokerService from '../../services/brokerService';
import toastService from '../../services/toastService';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setAuthenticationFailed } = useAuth();
  const [kiteProfile, setKiteProfile] = useState(null);
  const [kiteConnectionStatus, setKiteConnectionStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [isProcessingConnection, setIsProcessingConnection] = useState(false);

  useEffect(() => {
    // Handle Kite callback with request_token
    const query = new URLSearchParams(location.search);
    const request_token = query.get('request_token');
    if (request_token) {
      handleSetSession(request_token);
    } else {
      checkKiteProfile();
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetSession = async (request_token) => {
    setLoading(true);
    setIsProcessingConnection(true);
    toastService.dismissAll();
    
    const startTime = Date.now();
    
    try {
      const result = await brokerService.setSession(request_token);
      
      if (result.success) {
        // Session set successfully, now get profile info
        const profileResult = await brokerService.getProfileInfo();
        
        if (profileResult.success && profileResult.data) {
          const profileData = profileResult.data.data || profileResult.data;
          
          // Calculate elapsed time and ensure minimum 2-second delay
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 2000 - elapsedTime);
          
          // Wait for remaining time before completing the connection
          setTimeout(() => {
            setKiteProfile(profileData);
            setKiteConnectionStatus('connected');
            setIsProcessingConnection(false);
            
            toastService.success('Successfully connected to Zerodha!', 'Connection Successful');
            
            // Handle redirect logic
            const fromDashboard = localStorage.getItem('kiteLoginFromDashboard');
            if (fromDashboard === 'true') {
              localStorage.removeItem('kiteLoginFromDashboard');
            }
            
            // Clean up URL by removing query parameters
            navigate(location.pathname, { replace: true });
            setLoading(false);
          }, remainingTime);
        } else {
          throw new Error('Failed to get profile after session setup');
        }
      } else {
        throw new Error(result.message || 'Failed to set session');
      }
    } catch (error) {
      console.error('Set session error:', error);
      setKiteConnectionStatus('disconnected');
      setKiteProfile(null);
      setIsProcessingConnection(false);
      
      // Clean up localStorage and URL on error
      localStorage.removeItem('kiteLoginFromDashboard');
      navigate(location.pathname, { replace: true });
      
      toastService.error(error.message || 'Failed to connect to Zerodha. Please try again.', 'Connection Failed');
      setLoading(false);
    }
  };

  const checkKiteProfile = async () => {
    setLoading(true);
    toastService.dismissAll();
    
    try {
      const result = await brokerService.getProfileInfo();
      
      if (result.success && result.data) {
        const profileData = result.data.data || result.data;
        setKiteProfile(profileData);
        setKiteConnectionStatus('connected');
      } else {
        setKiteConnectionStatus('disconnected');
        setKiteProfile(null);
        toastService.warning('Unable to connect to Zerodha. Please check your broker connection.', 'Connection Issue');
      }
    } catch (err) {
      setKiteConnectionStatus('disconnected');
      setKiteProfile(null);
      
      if (err.message && err.message.includes('Authentication failed')) {
        toastService.error('Your session has expired. Redirecting to login...', 'Authentication Failed', 3000);
        setTimeout(() => {
          setAuthenticationFailed();
          navigate('/login');
        }, 2000);
        return;
      }
      
      toastService.error('Failed to connect to Zerodha. Please try again or check your broker credentials.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} lg={3}>
            <UserSummaryCard
              user={user}
              kiteProfile={kiteProfile}
              kiteConnectionStatus={kiteConnectionStatus}
              loading={loading}
              onRefreshProfile={checkKiteProfile}
            />
          </Grid>

          {/* Right Main Content */}
          <Grid item xs={12} lg={9}>
            <Stack spacing={3}>
              {/* Account Details */}
              <AccountDetailsCard kiteProfile={kiteProfile} />

              {/* Trading Capabilities */}
              <TradingCapabilitiesCard kiteProfile={kiteProfile} />

              {/* Connection Management */}
              <BrokerConnectionCard
                kiteConnectionStatus={kiteConnectionStatus}
                loading={loading}
                onCheckConnection={checkKiteProfile}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Connection Processing Backdrop */}
      <LoadingBackdrop
        open={isProcessingConnection}
        title="Processing Zerodha Connection"
        subtitle="Please wait while we complete your connection..."
      />
    </>
  );
};

export default Profile; 