import {
  AppBar,
  Box,
  Divider,
  Stack,
  Toolbar,
  alpha,
  useTheme
} from '@mui/material';
import React from 'react';

import Breadcrumbs from './Breadcrumbs';
import NavigationMenu from './NavigationMenu';
import UserMenu from './UserMenu';

const Layout = ({ children }) => {
  const theme = useTheme();

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
            <Breadcrumbs />
          </Box>

          {/* Right Side - Navigation Menu + User Controls */}
          <Stack direction="row" alignItems="center" spacing={3}>
            {/* Main Navigation */}
            <NavigationMenu />

            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />

            {/* User Controls */}
            <UserMenu />
          </Stack>
          

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