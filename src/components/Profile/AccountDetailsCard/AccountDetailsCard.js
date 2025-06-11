import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  Badge,
  Business,
  Email,
  Person,
  Security
} from '@mui/icons-material';

const AccountDetailsCard = ({ kiteProfile }) => {
  const theme = useTheme();

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: '16px'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'primary.main' }} />
          Account Information
        </Typography>

        {kiteProfile ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Badge sx={{ mr: 1, fontSize: 16 }} />
                  User ID
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.user_id}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 16 }} />
                  Email Address
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.email}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security sx={{ mr: 1, fontSize: 16 }} />
                  Account Type
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.user_type?.replace(/[_/]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business sx={{ mr: 1, fontSize: 16 }} />
                  Broker
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {kiteProfile.broker}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Connect your broker account to view detailed information
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard; 