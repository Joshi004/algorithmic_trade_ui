import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  Business,
  CheckCircle,
  Error,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

import KiteLoginButton from '../Common/KiteLoginButton';
import brokerService from '../../services/brokerService';
import brokerService from '../../services/brokerService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthenticatedDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setAuthenticationFailed } = useAuth();
  const [kiteConnectionStatus, setKiteConnectionStatus] = useState('unknown');
  const [brokerRegistrationStatus, setBrokerRegistrationStatus] = useState('unknown');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check Kite connection status and broker registration on mount
  useEffect(() => {
    checkKiteConnection();
    checkBrokerRegistrationStatus();
    
    // Add focus listener to refresh status when user returns to dashboard
    const handleFocus = () => {
      checkBrokerRegistrationStatus();
      checkKiteConnection();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Additional effect to check for broker registration completion
  useEffect(() => {
    // Check if user just completed broker registration
    const brokerRegistrationCompleted = localStorage.getItem('brokerRegistrationCompleted');
    if (brokerRegistrationCompleted) {
      // Remove the flag and refresh status
      localStorage.removeItem('brokerRegistrationCompleted');
      setTimeout(() => {
        checkBrokerRegistrationStatus();
      }, 1000); // Small delay to ensure backend has processed the registration
    }
  }, []);

  const checkKiteConnection = async () => {
    try {
      const result = await brokerService.getProfileInfo();
      if (result.success && result.data) {
        setKiteConnectionStatus('connected');
      } else {
        setKiteConnectionStatus('disconnected');
      }
    } catch (err) {
      setKiteConnectionStatus('disconnected');
      
      // Check if this is an authentication error
      if (err.message && err.message.includes('Authentication failed')) {
        setAuthenticationFailed();
        navigate('/login');
      }
    }
  };

  const checkBrokerRegistrationStatus = async () => {
    try {
      const result = await brokerService.checkBrokerRegistrationStatus();
      console.log('Broker registration status check result:', result);
      if (result.success) {
        const status = result.isRegistered ? 'registered' : 'not_registered';
        console.log('Setting broker registration status to:', status);
        setBrokerRegistrationStatus(status);
      } else {
        console.log('Broker registration check failed, setting to not_registered');
        setBrokerRegistrationStatus('not_registered');
      }
    } catch (err) {
      console.error('Error checking broker registration status:', err);
      setBrokerRegistrationStatus('not_registered');
    }
  };

  const handleKiteLoginInitiate = () => {
    // Store flag in localStorage to track that login was initiated from dashboard
    localStorage.setItem('kiteLoginFromDashboard', 'true');
  };

  const handleCheckConnectionStatus = async () => {
    setIsRefreshing(true);
    try {
      await checkBrokerRegistrationStatus();
      await checkKiteConnection();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box mb={6}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your algorithmic trading strategies and monitor your portfolio
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Quick Actions Card */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: '16px',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    Quick Actions
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/trade-management')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Trade Management
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/stock-management')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Stock Management
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate('/profile')}
                    sx={{ 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1.5
                    }}
                  >
                    Profile Management
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* System Status Card */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: '16px',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  System Status
                </Typography>
                
                <Stack spacing={3}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" color="text.secondary">
                      Trading Engine
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      <Chip label="Online" color="success" size="small" />
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" color="text.secondary">
                      Broker Registration
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {brokerRegistrationStatus === 'registered' ? (
                        <>
                          <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                          <Chip label="Registered" color="success" size="small" />
                        </>
                      ) : brokerRegistrationStatus === 'not_registered' ? (
                        <>
                          <Warning sx={{ color: 'warning.main', mr: 1 }} />
                          <Chip label="Not Registered" color="warning" size="small" />
                        </>
                      ) : (
                        <>
                          <Error sx={{ color: 'info.main', mr: 1 }} />
                          <Chip label="Checking..." color="info" size="small" />
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2" color="text.secondary">
                      Broker Connection
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {kiteConnectionStatus === 'connected' ? (
                        <>
                          <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                          <Chip label="Connected" color="success" size="small" />
                        </>
                      ) : kiteConnectionStatus === 'disconnected' ? (
                        <>
                          <Error sx={{ color: 'warning.main', mr: 1 }} />
                          <Chip label="Disconnected" color="warning" size="small" />
                        </>
                      ) : (
                        <>
                          <Error sx={{ color: 'info.main', mr: 1 }} />
                          <Chip label="Checking..." color="info" size="small" />
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  {(brokerRegistrationStatus !== 'unknown' || kiteConnectionStatus !== 'unknown') && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
                      <Stack spacing={1.5}>
                        {/* Show Register Broker Button only if not registered */}
                        {brokerRegistrationStatus === 'not_registered' && (
                          <Button 
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<Business />}
                            onClick={() => navigate('/broker-registration')}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: '8px',
                              py: 1,
                              bgcolor: 'warning.main',
                              '&:hover': {
                                bgcolor: 'warning.dark'
                              }
                            }}
                          >
                            Register Broker
                          </Button>
                        )}
                        
                        {/* Show Connect to Zerodha Button if registered but not connected */}
                        {brokerRegistrationStatus === 'registered' && kiteConnectionStatus === 'disconnected' && (
                          <KiteLoginButton 
                            variant="contained"
                            size="small"
                            fullWidth
                            onInitiate={handleKiteLoginInitiate}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: '8px',
                              py: 1
                            }}
                          >
                            Connect to Zerodha
                          </KiteLoginButton>
                        )}
                        
                        {/* Always show Check Status button */}
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={handleCheckConnectionStatus}
                          disabled={isRefreshing}
                          fullWidth
                          sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            py: 1
                          }}
                        >
                          {isRefreshing ? (
                            <Box display="flex" alignItems="center">
                              <CircularProgress size={16} sx={{ mr: 1 }} />
                              Refreshing...
                            </Box>
                          ) : (
                            'Refresh Status'
                          )}
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthenticatedDashboard; 