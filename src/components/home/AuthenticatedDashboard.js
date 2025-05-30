import {
  AccountBalance,
  AccountCircle,
  AutoGraph,
  CheckCircle,
  Error,
  Logout,
  TrendingUp
} from '@mui/icons-material';
import {
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
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import TokenStatus from '../Common/TokenStatus';
import kiteService from '../../services/kiteService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthenticatedDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, setAuthenticationFailed } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

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
            {/* Compact Token Status in Header Only Show In Development*/}
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
            <MenuItem onClick={handleProfileClick}>
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