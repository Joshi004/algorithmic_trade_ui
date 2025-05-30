import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Error,
  TrendingUp
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

import kiteService from '../../services/kiteService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthenticatedDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setAuthenticationFailed } = useAuth();
  const [kiteConnectionStatus, setKiteConnectionStatus] = useState('unknown');

  // Check Kite connection status on mount
  useEffect(() => {
    checkKiteConnection();
  }, []);

  const checkKiteConnection = async () => {
    try {
      const result = await kiteService.getProfileInfo();
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
                      Market Data
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      <Chip label="Connected" color="success" size="small" />
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