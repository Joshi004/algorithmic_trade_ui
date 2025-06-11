import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  AccountBalance,
  Refresh
} from '@mui/icons-material';
import KiteLoginButton from '../../Common/KiteLoginButton';

const BrokerConnectionCard = ({ kiteConnectionStatus, loading, onCheckConnection }) => {
  const theme = useTheme();

  if (kiteConnectionStatus !== 'disconnected') {
    return null;
  }

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
          <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
          Broker Connection
        </Typography>

        <Box>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
            <Typography variant="subtitle2" gutterBottom>
              Broker Not Connected
            </Typography>
            <Typography variant="body2">
              Connect your Zerodha account to access trading features and view your profile information.
            </Typography>
          </Alert>

          <Stack spacing={2}>
            <KiteLoginButton 
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                textTransform: 'none',
                borderRadius: '12px',
                py: 1.5
              }}
            >
              Connect to Zerodha
            </KiteLoginButton>
            
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={onCheckConnection}
              disabled={loading}
              fullWidth
              sx={{ 
                textTransform: 'none',
                borderRadius: '12px',
                py: 1.5
              }}
            >
              {loading ? 'Checking...' : 'Check Connection Status'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrokerConnectionCard; 