import {
  AccountCircle,
  AutoGraph,
  Logout,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';

import TokenStatus from '../Common/TokenStatus';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleDashboardClick = () => {
    handleMenuClose();
    navigate('/home');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Persistent Global Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Toolbar>
          {/* Application Logo/Title */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ cursor: 'pointer' }}
            onClick={handleDashboardClick}
          >
            <AutoGraph sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              ATS
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Right Side - Token Status + User Menu */}
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Token Status for Development */}
            <TokenStatus show={true} compact={true} />
            
            {/* User Info */}
            <Typography variant="body2" color="text.secondary">
              {user?.first_name || user?.email?.split('@')[0] || 'User'}
            </Typography>
            
            {/* User Menu */}
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
          
          {/* User Dropdown Menu */}
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
            <MenuItem onClick={handleDashboardClick}>
              <AutoGraph sx={{ mr: 2 }} />
              Dashboard
            </MenuItem>
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

      {/* Page Content */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 