import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const TradingCapabilitiesCard = ({ kiteProfile }) => {
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
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          Trading Capabilities
        </Typography>

        {kiteProfile ? (
          <Grid container spacing={3}>
            {/* Exchanges */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Available Exchanges
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.exchanges?.length > 0 ? kiteProfile.exchanges.map((exchange) => (
                    <Chip 
                      key={exchange}
                      label={exchange}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No exchanges available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Products */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'secondary.main' }}>
                  Available Products
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.products?.length > 0 ? kiteProfile.products.map((product) => (
                    <Chip 
                      key={product}
                      label={product}
                      size="small"
                      color="secondary"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No products available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Order Types */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`, borderRadius: '12px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                  Order Types
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {kiteProfile.order_types?.length > 0 ? kiteProfile.order_types.map((orderType) => (
                    <Chip 
                      key={orderType}
                      label={orderType}
                      size="small"
                      color="info"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )) : (
                    <Typography variant="body2" color="text.secondary">No order types available</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              Connect your broker account to view trading capabilities
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingCapabilitiesCard; 