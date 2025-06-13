import { AccountCircle, Logout, Person } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TokenStatus from '../Common/TokenStatus';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const navigate = useNavigate();
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

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
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
        <MenuItem onClick={handleProfileClick}>
          <Person sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu; 