import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Person,
  Refresh,
  Settings,
  Warning
} from '@mui/icons-material';

const UserSummaryCard = ({ 
  user,
  kiteProfile, 
  kiteConnectionStatus, 
  loading, 
  onRefreshProfile 
}) => {
  const theme = useTheme();

  return (
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
            onClick={onRefreshProfile}
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
};

export default UserSummaryCard; 