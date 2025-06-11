import {
  AccountBalance,
  Badge,
  Business,
  CheckCircle,
  Email,
  Person,
  Refresh,
  Security,
  Settings,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import KiteLoginButton from '../Common/KiteLoginButton';
import brokerService from '../../services/brokerService';
import toastService from '../../services/toastService';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const theme = useTheme();
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

  const renderUserSummaryCard = () => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: '16px',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        position: 'sticky',
        top: 24
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              mb: 2,
              fontSize: '2rem'
            }}
          >
            {kiteProfile?.user_shortname?.[0] || <Person fontSize="large" />}
          </Avatar>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {kiteProfile?.user_name || user?.first_name || 'User'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {kiteProfile?.email || user?.email || 'No email'}
          </Typography>

          {/* Connection Status */}
          <Box sx={{ mt: 2, mb: 3 }}>
            {kiteConnectionStatus === 'connected' ? (
              <Chip 
                icon={<CheckCircle />}
                label="Connected"
                color="success"
                variant="filled"
                sx={{ fontWeight: 'bold' }}
              />
            ) : kiteConnectionStatus === 'disconnected' ? (
              <Chip 
                icon={<Warning />}
                label="Disconnected"
                color="warning"
                variant="filled"
                sx={{ fontWeight: 'bold' }}
              />
            ) : (
              <Chip 
                icon={<Settings />}
                label="Checking..."
                color="info"
                variant="filled"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>

          {/* Quick Stats */}
          {kiteProfile && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Typography variant="caption" color="text.secondary">
                      Exchanges
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {kiteProfile.exchanges?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                    <Typography variant="caption" color="text.secondary">
                      Products
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      {kiteProfile.products?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Action Button */}
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={checkKiteProfile}
            disabled={loading}
            fullWidth
            sx={{ 
              textTransform: 'none',
              borderRadius: '12px'
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Profile'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAccountDetailsCard = () => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: '16px'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'primary.main' }} />
          Account Information
        </Typography>

        {kiteProfile ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Badge sx={{ mr: 1, fontSize: 16 }} />
                  User ID
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.user_id}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 16 }} />
                  Email Address
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.email}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security sx={{ mr: 1, fontSize: 16 }} />
                  Account Type
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.user_type?.replace(/[_/]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business sx={{ mr: 1, fontSize: 16 }} />
                  Broker
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.broker}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Connect your broker account to view detailed information
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderTradingCapabilitiesCard = () => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: '16px'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          Trading Capabilities
        </Typography>

        {kiteProfile ? (
          <Grid container spacing={3}>
            {/* Exchanges */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Available Exchanges
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.exchanges?.length > 0 ? kiteProfile.exchanges.map((exchange) => (
                    <Chip 
                      key={exchange}
                      label={exchange}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No exchanges available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Products */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'secondary.main' }}>
                  Available Products
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.products?.length > 0 ? kiteProfile.products.map((product) => (
                    <Chip 
                      key={product}
                      label={product}
                      size="small"
                      color="secondary"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No products available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Order Types */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                  Order Types
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.order_types?.length > 0 ? kiteProfile.order_types.map((orderType) => (
                    <Chip 
                      key={orderType}
                      label={orderType}
                      size="small"
                      color="info"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No order types available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Connect your broker account to view trading capabilities
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderConnectionCard = () => (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: '16px'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
          <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
          Broker Connection
        </Typography>

        {kiteConnectionStatus === 'disconnected' && (
          <Box>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle2" gutterBottom>
                Broker Not Connected
              </Typography>
              <Typography variant="body2">
                Connect your Zerodha account to access trading features and view your profile information.
              </Typography>
            </Alert>

            <Stack spacing={2}>
              <KiteLoginButton 
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '12px',
                  py: 1.5
                }}
              >
                Connect to Zerodha
              </KiteLoginButton>
              
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={checkKiteProfile}
                disabled={loading}
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '12px',
                  py: 1.5
                }}
              >
                {loading ? 'Checking...' : 'Check Connection Status'}
              </Button>
            </Stack>
          </Box>
        )}


      </CardContent>
    </Card>
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar */}
          <Grid item xs={12} lg={3}>
            {renderUserSummaryCard()}
          </Grid>

          {/* Right Main Content */}
          <Grid item xs={12} lg={9}>
            <Stack spacing={3}>
              {/* Account Details */}
              {renderAccountDetailsCard()}

              {/* Trading Capabilities */}
              {renderTradingCapabilitiesCard()}

              {/* Connection Management */}
              {kiteConnectionStatus === 'disconnected' && renderConnectionCard()}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Connection Processing Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isProcessingConnection}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" color="inherit">
          Processing Zerodha Connection
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
          Please wait while we complete your connection...
        </Typography>
      </Backdrop>
    </>
  );
};

export default Profile; 