import {
  AccessTime as AccessTimeIcon,
  Settings as AlgorithmIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  ShowChart as ShowChartIcon,
  Stop as StopIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import React, { Component } from 'react';

import ENDPOINTS from '../../../../../services/endpoints';
import apiService from '../../../../../services/apiService';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAccordion = styled(Accordion)(({ theme, isdummy }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${isdummy === 'true' ? theme.palette.warning.main : theme.palette.divider}`,
  backgroundColor: isdummy === 'true' ? theme.palette.warning.light + '08' : theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(1.5)}px 0`,
    boxShadow: theme.shadows[3],
  },
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: isdummy === 'true' ? theme.palette.warning.main : theme.palette.primary.light,
  },
  transition: theme.transitions.create(['box-shadow', 'border-color'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'started':
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.contrastText,
        };
      case 'paused':
        return {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
        };
      case 'stopped':
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
        };
      default:
        return {
          backgroundColor: theme.palette.grey[300],
          color: theme.palette.grey[800],
        };
    }
  };

  return {
    ...getStatusColor(),
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
  };
});

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

class TradeSessionAccordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionDetails: null,
      loadingDetails: false,
      detailsError: null,
      expanded: false,
    };
  }

  fetchSessionDetails = async (sessionId) => {
    if (this.state.loadingDetails) return;

    this.setState({ loadingDetails: true, detailsError: null });

    try {
      const response = await apiService.get(
        `${ENDPOINTS.TRADE_SESSIONS.GET_DETAILS}?trade_session_id=${sessionId}`
      );

      // Extract session details from response (consistent with other API calls)
      const sessionData = response?.data || response;
      
      this.setState({ 
        sessionDetails: sessionData,
        loadingDetails: false 
      });
      
      // If onSessionUpdate is provided, update the parent component's session data
      if (this.props.onSessionUpdate) {
        this.props.onSessionUpdate(sessionId, sessionData);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      this.setState({ 
        detailsError: error.message || 'Failed to load session details',
        loadingDetails: false 
      });
    }
  };

  handleAccordionChange = (event, isExpanded) => {
    this.setState({ expanded: isExpanded });
    
    if (isExpanded && !this.state.sessionDetails) {
      this.fetchSessionDetails(this.props.session.id);
    }
  };

  handleRefreshDetails = () => {
    this.fetchSessionDetails(this.props.session.id);
  };

  formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  formatCurrency = (amount) => {
    if (!amount || amount === 0) return '₹0.00';
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return '0%';
    return `${percentage.toFixed(1)}%`;
  };

  getAlgorithmName = (algorithmId, algorithmType) => {
    const { sessionParameters } = this.props;
    if (!sessionParameters || !algorithmId) return `ID: ${algorithmId || 'N/A'}`;

    let algorithms = [];
    switch (algorithmType) {
      case 'scanning':
        algorithms = sessionParameters.scanning_algorithms || [];
        break;
      case 'initiation':
        algorithms = sessionParameters.initiation_algorithms || [];
        break;
      case 'termination':
        algorithms = sessionParameters.termination_algorithms || [];
        break;
      default:
        return `ID: ${algorithmId}`;
    }

    const algorithm = algorithms.find(algo => algo.id === algorithmId);
    return algorithm ? (algorithm.display_name || algorithm.name) : `ID: ${algorithmId}`;
  };

  getStatusIcon = (status) => {
    switch (status) {
      case 'started':
        return <PlayArrowIcon />;
      case 'paused':
        return <PauseIcon />;
      case 'stopped':
        return <StopIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  handleAction = (action, sessionId) => {
    // This will be handled by parent component
    if (this.props.onAction) {
      this.props.onAction(action, sessionId);
    }
  };

  renderDetailedStats = () => {
    const { sessionDetails, loadingDetails, detailsError } = this.state;

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
            onClick={this.handleRefreshDetails}
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
              onClick={this.handleRefreshDetails}
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
                {this.formatCurrency(total_profit)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Profit/Loss
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {this.formatPercentage(success_percentage)}
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
              {this.formatDateTime(last_activity_at)}
            </Typography>
          </InfoBox>
        )}
      </Box>
    );
  };

  render() {
    const { session } = this.props;
    const {
      id,
      status,
      started_at,
      closed_at,
      dummy,
      initiation_algorithm_id,
      termination_algorithm_id,
      scanning_algorithm_id,
      trading_frequency
    } = session;

    const isDummy = dummy === 1 || dummy === true;

    return (
      <StyledAccordion 
        isdummy={isDummy.toString()}
        expanded={this.state.expanded}
        onChange={this.handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`session-${id}-content`}
          id={`session-${id}-header`}
          sx={{ 
            py: 1.5,
            minHeight: 'auto',
            '&.Mui-expanded': {
              minHeight: 'auto',
            },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
            },
            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: '12px 0',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mr: 2 }}>
            {/* Status & Info Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              minWidth: 200,
              pr: 2
            }}>
              {this.getStatusIcon(status)}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <StatusChip
                    status={status}
                    label={status}
                    size="small"
                  />
                  {isDummy && (
                    <Chip
                      label="Demo"
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Started: {this.formatDateTime(started_at)}
                  {status === 'stopped' && closed_at && (
                    <>
                      <br />
                      Closed: {this.formatDateTime(closed_at)}
                    </>
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Vertical Divider */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mx: 1, 
                borderColor: 'divider',
                height: 40
              }} 
            />

            {/* Scanning Algorithm */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              minWidth: 180,
              justifyContent: 'flex-start',
              pr: 1
            }}>
              <AnalyticsIcon sx={{ fontSize: 20, color: 'primary.main', flexShrink: 0 }} />
              <Chip
                label={this.getAlgorithmName(scanning_algorithm_id, 'scanning')}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: 26, 
                  fontWeight: 500,
                  maxWidth: 140,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </Box>

            {/* Vertical Divider */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mx: 1, 
                borderColor: 'divider',
                height: 40
              }} 
            />

            {/* Initiation Algorithm */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              minWidth: 180,
              justifyContent: 'flex-start',
              pr: 1
            }}>
              <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
              <Chip
                label={this.getAlgorithmName(initiation_algorithm_id, 'initiation')}
                size="small"
                variant="outlined"
                color="success"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: 26, 
                  fontWeight: 500,
                  maxWidth: 140,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </Box>

            {/* Vertical Divider */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mx: 1, 
                borderColor: 'divider',
                height: 40
              }} 
            />

            {/* Termination Algorithm */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              minWidth: 180,
              justifyContent: 'flex-start',
              pr: 1
            }}>
              <StopIcon sx={{ fontSize: 20, color: 'error.main', flexShrink: 0 }} />
              <Chip
                label={this.getAlgorithmName(termination_algorithm_id, 'termination')}
                size="small"
                variant="outlined"
                color="error"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: 26, 
                  fontWeight: 500,
                  maxWidth: 140,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            </Box>

            {/* Vertical Divider */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                mx: 1, 
                borderColor: 'divider',
                height: 40
              }} 
            />

            {/* Trading Frequency */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              minWidth: 120,
              justifyContent: 'flex-start',
              flex: 1
            }}>
              <ScheduleIcon sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }} />
              <Chip
                label={trading_frequency}
                size="small"
                variant="filled"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: 26, 
                  bgcolor: 'grey.200',
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'grey.300'
                  }
                }}
              />
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails>
          <Box sx={{ width: '100%' }}>
            <Divider sx={{ mb: 3 }} />
            
            {/* Show detailed statistics instead of basic info */}
            {this.renderDetailedStats()}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Session Controls
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {status === 'started' && (
                  <>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<PauseIcon />}
                      onClick={() => this.handleAction('pause', id)}
                      sx={{ minWidth: 100 }}
                    >
                      Pause
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<StopIcon />}
                      onClick={() => this.handleAction('stop', id)}
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
                      onClick={() => this.handleAction('resume', id)}
                      sx={{ minWidth: 100 }}
                    >
                      Resume
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<StopIcon />}
                      onClick={() => this.handleAction('stop', id)}
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
      </StyledAccordion>
    );
  }
}

export default TradeSessionAccordion; 