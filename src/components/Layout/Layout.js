import {
  AccountCircle,
  Assessment,
  AutoGraph,
  Business,
  ChevronRight,
  Home,
  Logout,
  Person,
  TrendingUp
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import TokenStatus from '../Common/TokenStatus';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

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

  // Generate breadcrumbs from current location
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbMap = {
      'home': { label: 'Dashboard', icon: <Home sx={{ fontSize: 18 }} /> },
      'profile': { label: 'Profile', icon: <Person sx={{ fontSize: 18 }} /> },
      'trade-management': { label: 'Trade Management', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
      'stock-management': { label: 'Stock Management', icon: <Assessment sx={{ fontSize: 18 }} /> },

      'broker-registration': { label: 'Broker Registration', icon: <Business sx={{ fontSize: 18 }} /> }
    };

    const breadcrumbs = [
      {
        label: 'ATS',
        path: '/home',
        icon: <AutoGraph sx={{ fontSize: 18 }} />,
        isRoot: true
      }
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const breadcrumbInfo = breadcrumbMap[segment];
      if (breadcrumbInfo) {
        breadcrumbs.push({
          label: breadcrumbInfo.label,
          path: currentPath,
          icon: breadcrumbInfo.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const navigationItems = [
    { label: 'Dashboard', path: '/home', icon: <Home sx={{ fontSize: 18 }} /> },
    { label: 'Trade Management', path: '/trade-management', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
    { label: 'Stock Management', path: '/stock-management', icon: <Assessment sx={{ fontSize: 18 }} /> },
  ];

  const renderBreadcrumbs = () => (
    <Breadcrumbs
      separator={<ChevronRight sx={{ color: 'text.secondary', fontSize: 16 }} />}
      sx={{ 
        '& .MuiBreadcrumbs-ol': { 
          alignItems: 'center' 
        }
      }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isActive = location.pathname === breadcrumb.path;
        
        return isLast || isActive ? (
          <Box
            key={breadcrumb.path}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: breadcrumb.isRoot ? 'primary.main' : 'text.primary',
              fontWeight: breadcrumb.isRoot ? 'bold' : 'medium'
            }}
          >
            {breadcrumb.icon}
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                fontWeight: breadcrumb.isRoot ? 'bold' : 'medium',
                color: breadcrumb.isRoot ? 'primary.main' : 'text.primary'
              }}
            >
              {breadcrumb.label}
            </Typography>
          </Box>
        ) : (
          <Link
            key={breadcrumb.path}
            component="button"
            variant="body2"
            onClick={() => navigate(breadcrumb.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: breadcrumb.isRoot ? 'primary.main' : 'text.secondary',
              textDecoration: 'none',
              fontWeight: breadcrumb.isRoot ? 'bold' : 'normal',
              '&:hover': {
                color: breadcrumb.isRoot ? 'primary.dark' : 'text.primary',
                textDecoration: 'none'
              },
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {breadcrumb.icon}
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                fontWeight: breadcrumb.isRoot ? 'bold' : 'normal'
              }}
            >
              {breadcrumb.label}
            </Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );

  const renderNavigationMenu = () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            variant={isActive ? 'contained' : 'text'}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              minWidth: 'auto',
              fontWeight: isActive ? 'bold' : 'medium',
              ...(isActive ? {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15)
                }
              } : {
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.5),
                  color: 'text.primary'
                }
              })
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Enhanced Global Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          zIndex: theme.zIndex.appBar
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          {/* Left Side - Breadcrumb Navigation */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {renderBreadcrumbs()}
          </Box>

          {/* Right Side - Navigation Menu + User Controls */}
          <Stack direction="row" alignItems="center" spacing={3}>
            {/* Main Navigation */}
            {renderNavigationMenu()}

            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />

            {/* User Controls */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Token Status for Development */}
              <TokenStatus show={true} compact={true} />
              
              {/* User Info */}
              <Typography variant="body2" color="text.secondary">
                {user?.first_name || user?.email?.split('@')[0] || 'User'}
              </Typography>
              
              {/* User Menu */}
              <IconButton
                size="small"
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
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <Person sx={{ mr: 2 }} />
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