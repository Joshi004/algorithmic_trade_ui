import {
  AccountBalance,
  AccountCircle,
  AutoGraph,
  CheckCircle,
  Error,
  Logout,
  Refresh,
  TrendingUp
} from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import KiteLoginButton from '../Common/KiteLoginButton';
import TokenStatus from '../Common/TokenStatus';
import kiteService from '../../services/kiteService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthenticatedDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, setAuthenticationFailed } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [kiteProfile, setKiteProfile] = useState(null);
  const [kiteConnectionStatus, setKiteConnectionStatus] = useState('unknown'); // Start as unknown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check Kite profile on mount to provide immediate feedback
  useEffect(() => {
    console.log('AuthenticatedDashboard mounted - checking Kite profile...');
    checkKiteProfile();
  }, []);

  const checkKiteProfile = async () => {
    setLoading(true);
    setError('');
    console.log('Manually checking Kite profile...');
    
    try {
      const result = await kiteService.getProfileInfo();
      console.log('Kite profile result:', result);
      
      if (result.success) {
        setKiteProfile(result.data);
        setKiteConnectionStatus('connected');
        setError('');
      } else {
        setKiteConnectionStatus('disconnected');
        setKiteProfile(null);
        // Don't show error for profile info failures - it's expected if not connected
        console.log('Kite profile check failed (expected if not connected):', result);
      }
    } catch (err) {
      console.log('Kite profile check error:', err.message);
      setKiteConnectionStatus('disconnected');
      setKiteProfile(null);
      
      // Check if this is an authentication error (user needs to login again)
      if (err.message && err.message.includes('Authentication failed')) {
        console.log('Authentication failed - redirecting to login');
        setAuthenticationFailed();
        navigate('/login');
        return;
      }
      
      // For other errors (like not connected to Zerodha), just log them
      console.log('Kite profile check failed (probably not connected to Zerodha)');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const renderKiteConnectionCard = () => (
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
          <AccountBalance sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            Broker Connection
          </Typography>
        </Box>

        {kiteConnectionStatus === 'connected' && kiteProfile ? (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
              <Chip 
                label="Connected to Zerodha" 
                color="success" 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: '12px',
                mb: 3
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Details
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {kiteProfile.user_name || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                User ID: {kiteProfile.user_id || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email: {kiteProfile.email || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broker: {kiteProfile.broker || 'Zerodha'}
              </Typography>
            </Paper>

            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={checkKiteProfile}
              disabled={loading}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Refresh Profile
            </Button>
          </Box>
        ) : kiteConnectionStatus === 'disconnected' ? (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Error sx={{ color: 'warning.main', mr: 1 }} />
              <Chip 
                label="Not Connected" 
                color="warning" 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect your Zerodha account to start algorithmic trading. 
              This will allow the system to execute trades on your behalf.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <KiteLoginButton 
                variant="contained"
                fullWidth
                size="large"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px'
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
                sx={{ textTransform: 'none' }}
              >
                Check Connection Status
              </Button>
            </Stack>
          </Box>
        ) : (
          // Unknown status - initial state
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Error sx={{ color: 'info.main', mr: 1 }} />
              <Chip 
                label="Status Unknown" 
                color="info" 
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Check your Zerodha connection status or connect your account to start algorithmic trading.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <Button 
                variant="contained" 
                startIcon={<Refresh />}
                onClick={checkKiteProfile}
                disabled={loading}
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px'
                }}
              >
                {loading ? 'Checking...' : 'Check Zerodha Connection'}
              </Button>
              
              <KiteLoginButton 
                variant="outlined"
                fullWidth
                size="large"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px'
                }}
              >
                Connect to Zerodha
              </KiteLoginButton>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            <AutoGraph sx={{ mr: 1, verticalAlign: 'middle' }} />
            Algorithmic Trading System
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Compact Token Status in Header Only Show In Dvelopment*/}
            <TokenStatus show={true} compact={true} />
            
            <Typography variant="body2" color="text.secondary">
              Welcome, {user?.first_name || user?.email?.split('@')[0] || 'User'}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Stack>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
          {/* Kite Connection Card */}
          <Grid item xs={12} md={6}>
            {renderKiteConnectionCard()}
          </Grid>

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
                    onClick={() => navigate('/profile-management')}
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
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: '16px'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  System Status
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Trading Engine
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        Online
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Market Data
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        Connected
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      {kiteConnectionStatus === 'connected' ? (
                        <>
                          <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Broker
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            Connected
                          </Typography>
                        </>
                      ) : kiteConnectionStatus === 'disconnected' ? (
                        <>
                          <Error sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Broker
                          </Typography>
                          <Typography variant="h6" color="warning.main">
                            Disconnected
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Error sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Broker
                          </Typography>
                          <Typography variant="h6" color="info.main">
                            Unknown
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthenticatedDashboard; 