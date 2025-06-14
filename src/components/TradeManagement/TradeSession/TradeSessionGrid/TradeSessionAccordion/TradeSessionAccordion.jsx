import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import {
  Settings as AlgorithmIcon,
  Analytics as AnalyticsIcon,
  ExpandMore as ExpandMoreIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  Stop as StopIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import React, { Component } from 'react';

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

class TradeSessionAccordion extends Component {
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
      <StyledAccordion isdummy={isDummy.toString()}>
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
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlgorithmIcon />
              Additional Details & Actions
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <InfoBox>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Algorithm Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Scanning ID:</Typography>
                      <Typography variant="body2" fontWeight="500">{scanning_algorithm_id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Initiation ID:</Typography>
                      <Typography variant="body2" fontWeight="500">{initiation_algorithm_id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Termination ID:</Typography>
                      <Typography variant="body2" fontWeight="500">{termination_algorithm_id}</Typography>
                    </Box>
                  </Box>
                </InfoBox>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <InfoBox>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Session Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Session ID:</Typography>
                      <Typography variant="body2" fontWeight="500">{id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Mode:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {isDummy ? 'Demo/Paper Trading' : 'Live Trading'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Started:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {this.formatDateTime(started_at)}
                      </Typography>
                    </Box>
                    {status === 'stopped' && closed_at && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Closed:</Typography>
                        <Typography variant="body2" fontWeight="500">
                          {this.formatDateTime(closed_at)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </InfoBox>
              </Grid>
            </Grid>
            
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