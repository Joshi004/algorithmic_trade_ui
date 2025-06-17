import React from 'react';
import {
  AccordionDetails,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  LaunchRounded as ViewLiveIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  ShowChart as ShowChartIcon,
  Stop as StopIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatsValue = styled(Typography)(({ theme, color }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(0.5),
  color: color || theme.palette.text.primary,
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const ProfitBox = styled(Box)(({ theme, isprofit }) => {
  const isPositive = isprofit === 'true';
  return {
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.spacing(1),
    backgroundColor: isPositive 
      ? theme.palette.success.light + '20' 
      : theme.palette.error.light + '20',
    border: `1px solid ${isPositive ? theme.palette.success.main : theme.palette.error.main}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  };
});

const TradeSessionDetails = ({ 
  session, 
  sessionDetails, 
  loadingDetails, 
  detailsError,
  onRefreshDetails,
  onAction,
  formatDateTime,
  formatCurrency,
  formatPercentage
}) => {
  // Using a wrapper component to handle navigation
  const DetailsContent = () => {
    const navigate = useNavigate();
    const { id, status } = session;

    const handleViewLive = () => {
      navigate(`/trade-sessions/${id}/live`);
    };

    const renderDetailedStats = () => {
      if (loadingDetails) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        );
      }

      if (detailsError) {
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error" variant="body2" gutterBottom>
              {detailsError}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={onRefreshDetails}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          </Box>
        );
      }

      if (!sessionDetails) {
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No details available
            </Typography>
          </Box>
        );
      }

      const {
        total_trades_executed,
        total_long_trades,
        total_short_trades,
        total_instruments_scanned,
        active_trades,
        total_profit,
        success_percentage,
        last_activity_at
      } = sessionDetails;

      const isProfit = total_profit >= 0;

      return (
        <Box sx={{ width: '100%' }}>
          {/* Profit/Loss Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon />
              Performance Summary
              <IconButton
                size="small"
                onClick={onRefreshDetails}
                disabled={loadingDetails}
                sx={{ ml: 'auto' }}
              >
                <RefreshIcon />
              </IconButton>
            </Typography>
            
            <ProfitBox isprofit={isProfit.toString()}>
              {isProfit ? <TrendingUpIcon /> : <TrendingDownIcon />}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatCurrency(total_profit)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Profit/Loss
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatPercentage(success_percentage)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Success Rate
                </Typography>
              </Box>
            </ProfitBox>
          </Box>

          {/* Statistics Grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <StatsCard>
                <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <StatsValue color="primary.main">
                  {total_trades_executed || 0}
                </StatsValue>
                <StatsLabel>Total Trades</StatsLabel>
              </StatsCard>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatsCard>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <StatsValue color="success.main">
                  {total_long_trades || 0}
                </StatsValue>
                <StatsLabel>Long Trades</StatsLabel>
              </StatsCard>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatsCard>
                <TrendingDownIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <StatsValue color="error.main">
                  {total_short_trades || 0}
                </StatsValue>
                <StatsLabel>Short Trades</StatsLabel>
              </StatsCard>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatsCard>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <StatsValue color="info.main">
                  {total_instruments_scanned || 0}
                </StatsValue>
                <StatsLabel>Instruments Scanned</StatsLabel>
              </StatsCard>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatsCard>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <StatsValue color="warning.main">
                  {active_trades || 0}
                </StatsValue>
                <StatsLabel>Active Trades</StatsLabel>
              </StatsCard>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatsCard>
                <ScheduleIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <StatsValue>
                  {last_activity_at ? 'Recent' : 'None'}
                </StatsValue>
                <StatsLabel>Last Activity</StatsLabel>
              </StatsCard>
            </Grid>
          </Grid>

          {/* Last Activity Details */}
          {last_activity_at && (
            <InfoBox>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Last Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(last_activity_at)}
              </Typography>
            </InfoBox>
          )}
        </Box>
      );
    };

    return (
      <AccordionDetails>
        <Box sx={{ width: '100%' }}>
          <Divider sx={{ mb: 3 }} />
          
          {/* Show detailed statistics */}
          {renderDetailedStats()}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Session Controls
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* View Live Button - Always visible for active sessions */}
              {(status === 'started' || status === 'paused') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ViewLiveIcon />}
                  onClick={handleViewLive}
                  sx={{ minWidth: 120 }}
                >
                  View Live
                </Button>
              )}
              
              {status === 'started' && (
                <>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<PauseIcon />}
                    onClick={() => onAction('pause', id)}
                    sx={{ minWidth: 100 }}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={() => onAction('stop', id)}
                    sx={{ minWidth: 100 }}
                  >
                    Stop
                  </Button>
                </>
              )}
              
              {status === 'paused' && (
                <>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => onAction('resume', id)}
                    sx={{ minWidth: 100 }}
                  >
                    Resume
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={() => onAction('stop', id)}
                    sx={{ minWidth: 100 }}
                  >
                    Stop
                  </Button>
                </>
              )}
              
              {status === 'stopped' && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Session has been terminated
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    );
  };

  return <DetailsContent />;
};

export default TradeSessionDetails; 