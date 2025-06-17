import React from 'react';
import {
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  ExpandMore as ExpandMoreIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  Stop as StopIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const TradeSessionSummary = ({ session, isDummy, getAlgorithmName, formatDateTime }) => {
  const {
    id,
    status,
    started_at,
    closed_at,
    initiation_algorithm_id,
    termination_algorithm_id,
    scanning_algorithm_id,
    trading_frequency
  } = session;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'started':
        return <PlayArrowIcon sx={{ fontSize: 20, color: 'success.main' }} />;
      case 'paused':
        return <PauseIcon sx={{ fontSize: 20, color: 'warning.main' }} />;
      case 'stopped':
        return <StopIcon sx={{ fontSize: 20, color: 'error.main' }} />;
      default:
        return <PlayArrowIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
    }
  };

  return (
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
          {getStatusIcon(status)}
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
              Started: {formatDateTime(started_at)}
              {status === 'stopped' && closed_at && (
                <>
                  <br />
                  Closed: {formatDateTime(closed_at)}
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
            label={getAlgorithmName(scanning_algorithm_id, 'scanning')}
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
            label={getAlgorithmName(initiation_algorithm_id, 'initiation')}
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
            label={getAlgorithmName(termination_algorithm_id, 'termination')}
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
  );
};

export default TradeSessionSummary; 