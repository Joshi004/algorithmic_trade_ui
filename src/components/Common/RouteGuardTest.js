import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RouteGuardTest = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  const testRoutes = [
    { path: '/login', label: 'Login (Guest Only)', type: 'guest' },
    { path: '/signup', label: 'Signup (Guest Only)', type: 'guest' },
    { path: '/home', label: 'Home (Public)', type: 'public' },
    { path: '/stock-management', label: 'Stock Management (Protected)', type: 'protected' },
    { path: '/trade-management', label: 'Trade Management (Protected)', type: 'protected' },
    { path: '/profile-management', label: 'Profile Management (Protected)', type: 'protected' },
    { path: '/broker-registration', label: 'Broker Registration (Protected)', type: 'protected' },
  ];

  const getChipColor = (type) => {
    switch (type) {
      case 'guest': return 'warning';
      case 'protected': return 'error';
      case 'public': return 'success';
      default: return 'default';
    }
  };

  const handleTestRoute = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading authentication status...</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Route Guard Test Panel
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Current Authentication Status:
          </Typography>
          <Chip 
            label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'} 
            color={isAuthenticated ? 'success' : 'error'}
            sx={{ mr: 2 }}
          />
          {isAuthenticated && (
            <Button variant="outlined" size="small" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>
          Test Routes:
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click on any route to test the guard behavior. Expected results:
        </Typography>
        
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="body2">
            • <strong>Guest Only</strong>: Redirects authenticated users to home
          </Typography>
          <Typography variant="body2">
            • <strong>Protected</strong>: Redirects unauthenticated users to login
          </Typography>
          <Typography variant="body2">
            • <strong>Public</strong>: Accessible to everyone
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {testRoutes.map((route) => (
            <Box key={route.path} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleTestRoute(route.path)}
                sx={{ minWidth: '200px', textAlign: 'left' }}
              >
                {route.path}
              </Button>
              <Chip 
                label={route.type} 
                color={getChipColor(route.type)} 
                size="small" 
              />
              <Typography variant="body2" color="text.secondary">
                {route.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>How to test:</strong> Try accessing protected routes when logged out, 
            or guest routes when logged in. The guards should redirect you appropriately 
            and preserve your intended destination for login redirects.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RouteGuardTest; 