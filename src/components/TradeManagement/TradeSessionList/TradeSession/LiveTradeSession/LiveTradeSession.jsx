import {
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  ArrowBack as BackIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ShowChart as ShowChartIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Alert,
  Badge,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ENDPOINTS from '../../../../../services/endpoints';
import apiService from '../../../../../services/apiService';
import cacheService from '../../../../../services/cacheService';
import { getWsUrl } from '../../../../../config';
import { styled } from '@mui/material/styles';
import websocketService from '../../../../../services/websocketService'; // Import our professional WebSocket service

// Styled Components
const LiveContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const LiveBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontWeight: 600,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 ${theme.palette.success.main}40`,
    },
    '70%': {
      boxShadow: `0 0 0 10px ${theme.palette.success.main}00`,
    },
    '100%': {
      boxShadow: `0 0 0 0 ${theme.palette.success.main}00`,
    },
  },
}));

const ScannerLogContainer = styled(Box)(({ theme }) => ({
  height: '300px',
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
}));

// Initial State
const initialState = {
  sessionData: null,
  sessionStats: {
    totalTrades: 0,
    activeTrades: 0,
    closedTrades: 0,
    successRate: 0,
    totalProfitLoss: 0,
  },
  trades: [],
  scannerStats: {
    totalScanned: 0,
    totalInstruments: 0,
    remainingCount: 0,
    eligible: 0,
    notEligible: 0,
    progressPercentage: 0,
    totalEligibleFound: 0,
    lastCycleDuration: 0,
  },
  scannerLogs: [],
  filters: {
    showActive: true,
    showClosed: true,
  },
  loading: {
    sessionStats: true,
    trades: true,
    scannerStats: true,
  },
  lastUpdate: new Date(),
  wsConnected: false,
  wsGroupName: null,
};

// Reducer for state management
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SESSION_DATA':
      const sessionData = action.payload;
      return {
        ...state,
        sessionData,
        sessionStats: {
          totalTrades: sessionData.total_trades_executed || 0,
          activeTrades: sessionData.active_trades || 0,
          closedTrades: (sessionData.total_trades_executed || 0) - (sessionData.active_trades || 0),
          successRate: sessionData.success_percentage || 0,
          totalProfitLoss: sessionData.total_profit || 0,
        },
        scannerStats: {
          ...state.scannerStats,
          totalScanned: sessionData.total_instruments_scanned || 0,
        },
        loading: { ...state.loading, sessionStats: false, scannerStats: false },
      };
    case 'SET_TRADES':
      return {
        ...state,
        trades: action.payload,
        loading: { ...state.loading, trades: false },
      };
    case 'ADD_SCANNER_LOG':
      return {
        ...state,
        scannerLogs: [action.payload, ...state.scannerLogs].slice(0, 50), // Keep only last 50 logs
      };
    case 'UPDATE_TRADE':
      return {
        ...state,
        trades: state.trades.map(trade =>
          trade.id === action.payload.id ? { ...trade, ...action.payload } : trade
        ),
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'SET_LAST_UPDATE':
      return {
        ...state,
        lastUpdate: action.payload,
      };
    case 'SET_WS_CONNECTION':
      return {
        ...state,
        wsConnected: action.payload.connected,
        wsGroupName: action.payload.groupName || state.wsGroupName,
      };
    case 'UPDATE_SCANNER_STATS':
      return {
        ...state,
        scannerStats: { 
          ...state.scannerStats, 
          ...action.payload,
          // Handle function-based updates for incrementing counters
          eligible: typeof action.payload.eligible === 'function' 
            ? action.payload.eligible(state.scannerStats.eligible)
            : action.payload.eligible !== undefined 
            ? action.payload.eligible 
            : state.scannerStats.eligible,
          notEligible: state.scannerStats.totalScanned - (
            typeof action.payload.eligible === 'function' 
              ? action.payload.eligible(state.scannerStats.eligible)
              : action.payload.eligible !== undefined 
              ? action.payload.eligible 
              : state.scannerStats.eligible
          )
        },
      };
    default:
      return state;
  }
};

/**
 * Professional WebSocket Hook for Live Trade Session
 * 
 * This hook integrates with our professional WebSocket service to provide real-time updates
 * for trade sessions. It handles:
 * - Automatic connection/reconnection using secure subprotocol authentication
 * - Scanner update subscriptions with proper group management
 * - Real-time trade updates and statistics
 * - Clean connection lifecycle management
 */
const useWebSocket = (sessionId, sessionData, dispatch) => {
  const messageHandlerRef = useRef(null);
  const isSubscribedRef = useRef(false);

  const getGroupName = (algorithmId, frequency) => {
    return `scanner_${algorithmId}_${frequency}`;
  };

  const getAlgorithmName = (algorithmId) => {
    // Get algorithm name from cached session parameters
    const sessionParameters = cacheService.getTradeSessionParams();
    if (!sessionParameters || !sessionParameters.scanning_algorithms) {
      return 'unknown';
    }
    
    const algorithm = sessionParameters.scanning_algorithms.find(algo => algo.id === algorithmId);
    return algorithm ? algorithm.name : 'unknown';
  };

  const getStepFromUpdateType = (updateType) => {
    const stepMap = {
      'volume_check': 'Volume Check',
      'trend_analysis': 'Trend Analysis',
      'trading_pairs_check': 'Trading Pairs Check',
      'reward_risk_check': 'Reward:Risk Check',
      'scanning_started': 'Scanning',
      'instrument_accepted': 'Acceptance',
      'instrument_rejected': 'Rejection'
    };
    return stepMap[updateType] || 'Unknown';
  };

  const getResultFromUpdateType = (updateType) => {
    if (updateType === 'instrument_accepted' || updateType === 'scanning_started') {
      return 'Passed';
    } else if (updateType === 'instrument_rejected') {
      return 'Failed';
    }
    return 'Processed';
  };

  const handleScannerUpdate = useCallback((data) => {
    // Handle different types of scanner updates
    if (data.update_type === 'instrument_eligible') {
      // Add scanner log entry for eligible instrument
      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date(data.timestamp || new Date()),
        instrument: data.symbol,
        step: 'Eligibility Check',
        result: 'ELIGIBLE',
        message: `${data.symbol} - ${data.effective_trend} trend, R:R ${data.reward_risk_ratio?.toFixed(2)}, Action: ${data.required_action}`,
        details: {
          effectiveTrend: data.effective_trend,
          rewardRiskRatio: data.reward_risk_ratio,
          supportPrice: data.support_price,
          resistancePrice: data.resistance_price,
          marketPrice: data.market_price,
          requiredAction: data.required_action,
          volume: data.volume,
          lastPrice: data.last_price
        }
      };

      dispatch({ type: 'ADD_SCANNER_LOG', payload: logEntry });
      
      // Update scanner stats - increment eligible count
      dispatch({ 
        type: 'UPDATE_SCANNER_STATS', 
        payload: { 
          eligible: (prev) => (prev || 0) + 1,
          totalEligibleFound: data.eligible_count
        } 
      });
      
    } else if (data.update_type === 'progress_update') {
      // Update scanning progress
      dispatch({ 
        type: 'UPDATE_SCANNER_STATS', 
        payload: { 
          totalScanned: data.total_scanned,
          remainingCount: data.remaining_count,
          progressPercentage: data.progress_percentage,
          totalInstruments: data.total_instruments
        } 
      });
      
      // Add progress log entry
      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date(data.timestamp || new Date()),
        instrument: 'Progress Update',
        step: 'Scanning Progress',
        result: 'INFO',
        message: `Scanned ${data.total_scanned}/${data.total_instruments} (${data.progress_percentage}%) - ${data.eligible_found} eligible found`
      };

      dispatch({ type: 'ADD_SCANNER_LOG', payload: logEntry });
      
    } else if (data.update_type === 'cycle_completed') {
      // Handle cycle completion
      dispatch({ 
        type: 'UPDATE_SCANNER_STATS', 
        payload: { 
          totalScanned: data.total_scanned,
          remainingCount: 0,
          progressPercentage: 100,
          totalInstruments: data.total_instruments,
          lastCycleDuration: data.cycle_duration
        } 
      });
      
      // Add cycle completion log entry
      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date(data.timestamp || new Date()),
        instrument: 'Scan Cycle',
        step: 'Cycle Completed',
        result: 'COMPLETED',
        message: `Cycle ${data.cycle_number} completed - ${data.eligible_found} eligible instruments found in ${data.cycle_duration?.toFixed(1)}s`
      };

      dispatch({ type: 'ADD_SCANNER_LOG', payload: logEntry });
    }

    dispatch({ type: 'SET_LAST_UPDATE', payload: new Date() });
  }, [dispatch]);

  const handleTradeUpdate = useCallback((data) => {
    // Handle real-time trade updates
    dispatch({ type: 'UPDATE_TRADE', payload: data });
    dispatch({ type: 'SET_LAST_UPDATE', payload: new Date() });
  }, [dispatch]);

  /**
   * Sets up message handling for our professional WebSocket service
   * Integrates with the existing singleton service for clean message routing
   */
  const setupMessageHandler = useCallback(() => {
    if (messageHandlerRef.current) return; // Already set up

    messageHandlerRef.current = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'scanner_update') {
          handleScannerUpdate(data);
        } else if (data.type === 'trade_update') {
          handleTradeUpdate(data);
        } else if (data.type === 'connection_established') {
          dispatch({ type: 'SET_WS_CONNECTION', payload: { connected: true } });
        } else if (data.type === 'subscription_success') {
          dispatch({ type: 'SET_WS_CONNECTION', payload: { connected: true, groupName: data.group_name } });
        } else if (data.type === 'error') {
          console.error('WebSocket subscription error:', data.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Add our message handler to the professional WebSocket service
    if (websocketService.socket) {
      websocketService.socket.addEventListener('message', messageHandlerRef.current);
    }
  }, [handleScannerUpdate, handleTradeUpdate, dispatch]);

  /**
   * Establishes WebSocket connection and subscribes to relevant groups
   * Uses professional authentication and group management
   */
  const connect = useCallback(() => {
    if (!sessionData) return;
    
    // Connect using our professional service (includes Sec-WebSocket-Protocol authentication)
    websocketService.connect();

    // Set up message handling
    setupMessageHandler();

    // Wait for connection and then subscribe to scanner updates
    const checkConnectionAndSubscribe = () => {
      if (websocketService.getConnectionStatus() && !isSubscribedRef.current) {
        // Subscribe to scanner group for this algorithm and frequency
        const algorithmId = getAlgorithmName(sessionData.scanning_algorithm_id);
        const frequency = sessionData.trading_frequency;
        const groupName = getGroupName(algorithmId, frequency);

        const subscribeMessage = {
          action: 'subscribe_scanner',
          algorithm_id: algorithmId,
          frequency: frequency
        };

        websocketService.send(subscribeMessage);
        isSubscribedRef.current = true;
        
        // Store group name for cleanup
        sessionStorage.setItem('ats_ws_group', groupName);
      } else if (!websocketService.getConnectionStatus()) {
        // Check again in 100ms if not connected yet
        setTimeout(checkConnectionAndSubscribe, 100);
      }
    };

    // Start checking for connection
    setTimeout(checkConnectionAndSubscribe, 100);
  }, [sessionData, setupMessageHandler]);

  /**
   * Cleans up WebSocket connections and unsubscribes from groups
   * Ensures proper resource cleanup when component unmounts
   */
  const disconnect = useCallback(() => {
    // Remove message handler
    if (messageHandlerRef.current && websocketService.socket) {
      websocketService.socket.removeEventListener('message', messageHandlerRef.current);
      messageHandlerRef.current = null;
    }

    // Unsubscribe from scanner group if subscribed
    if (websocketService.getConnectionStatus() && sessionData && isSubscribedRef.current) {
      const unsubscribeMessage = {
        action: 'unsubscribe_scanner',
        algorithm_id: getAlgorithmName(sessionData.scanning_algorithm_id),
        frequency: sessionData.trading_frequency
      };
      websocketService.send(unsubscribeMessage);
      isSubscribedRef.current = false;
    }

    // Clear session storage and update UI state
    sessionStorage.removeItem('ats_ws_group');
    dispatch({ type: 'SET_WS_CONNECTION', payload: { connected: false, groupName: null } });
  }, [sessionData, dispatch]);

  // Auto-connect when sessionData is available
  useEffect(() => {
    if (sessionData) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [sessionData, connect, disconnect]);

  // Monitor connection status for UI updates
  useEffect(() => {
    const checkConnection = () => {
      const isConnected = websocketService.getConnectionStatus();
      dispatch({ type: 'SET_WS_CONNECTION', payload: { connected: isConnected } });
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    connect,
    disconnect,
    isConnected: websocketService.getConnectionStatus()
  };
};

// API functions
const apiServiceHelpers = {
  getTradeSessionDetails: async (sessionId) => {
    try {
      const response = await apiService.get(`${ENDPOINTS.TRADE_SESSIONS.GET_DETAILS}?trade_session_id=${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trade session details:', error);
      throw error;
    }
  },

  getTrades: async (sessionId) => {
    // This would be a separate endpoint to get trades for a session
    // For now, we'll return empty array as trades are embedded in session details
    try {
      // This is a placeholder - in real implementation you might have a separate trades endpoint
      // const response = await apiService.get(`${ENDPOINTS.TRADES.GET_ALL}?trade_session_id=${sessionId}`);
      // return response.data;
      return [];
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  },
};

// Trade Statistics Component
const TradeStatistics = ({ stats, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(5)].map((_, index) => (
          <Grid item xs={12} md={2.4} key={index}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <CircularProgress size={24} />
              </CardContent>
            </StatsCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={2.4}>
        <StatsCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {stats.totalTrades}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Trades
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} md={2.4}>
        <StatsCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
              {stats.activeTrades}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Trades
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} md={2.4}>
        <StatsCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
              {stats.closedTrades}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Closed Trades
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} md={2.4}>
        <StatsCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
              {stats.successRate.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Success Rate
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>

      <Grid item xs={12} md={2.4}>
        <StatsCard>
          <CardContent sx={{ textAlign: 'center' }}>
            <AssessmentIcon sx={{ 
              fontSize: 40, 
              color: stats.totalProfitLoss >= 0 ? 'success.main' : 'error.main', 
              mb: 1 
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: stats.totalProfitLoss >= 0 ? 'success.main' : 'error.main',
              mb: 1
            }}>
              {formatCurrency(stats.totalProfitLoss)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total P&L
            </Typography>
          </CardContent>
        </StatsCard>
      </Grid>
    </Grid>
  );
};

// Trade Table Component
const TradeTable = ({ trades, filters, onFilterChange, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredTrades = trades.filter(trade => {
    if (!filters.showActive && trade.is_active) return false;
    if (!filters.showClosed && !trade.is_active) return false;
    return true;
  });

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChartIcon />
            Trade List
            <Badge badgeContent={filteredTrades.length} color="primary" />
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showActive}
                  onChange={(e) => onFilterChange({ showActive: e.target.checked })}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showClosed}
                  onChange={(e) => onFilterChange({ showClosed: e.target.checked })}
                />
              }
              label="Closed"
            />
          </Box>
        </Box>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Instrument</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Entry Price</TableCell>
                <TableCell align="right">Exit Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">P&L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No trades found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <Typography fontWeight="600">
                        {trade.instrument?.trading_symbol || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={trade.view?.toUpperCase() || 'UNKNOWN'}
                        size="small"
                        color={trade.view === 'long' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell>
                      <Chip 
                        label={trade.is_active ? 'ACTIVE' : 'CLOSED'}
                        size="small"
                        color={trade.is_active ? 'warning' : 'default'}
                        variant={trade.is_active ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!trade.is_active && trade.net_profit !== null ? (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          gap: 0.5
                        }}>
                          {trade.net_profit >= 0 ? 
                            <TrendingUpIcon color="success" fontSize="small" /> : 
                            <TrendingDownIcon color="error" fontSize="small" />
                          }
                          <Typography 
                            fontWeight="600"
                            color={trade.net_profit >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatCurrency(parseFloat(trade.net_profit))}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// Scanner Section Component
const ScannerSection = ({ scannerStats, scannerLogs, loading, wsConnected }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon />
            Live Scanner
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={wsConnected ? 'CONNECTED' : 'DISCONNECTED'}
              size="small"
              color={wsConnected ? 'success' : 'error'}
              variant="filled"
            />
            {scannerStats.progressPercentage > 0 && scannerStats.progressPercentage < 100 && (
              <Chip 
                label={`${scannerStats.progressPercentage}% Complete`}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        {/* Scanner Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h5" color="primary.main" fontWeight="600">
                {loading ? <CircularProgress size={24} /> : scannerStats.totalScanned}
                {scannerStats.totalInstruments > 0 && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    of {scannerStats.totalInstruments}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scanned
              </Typography>
              {scannerStats.progressPercentage > 0 && (
                <Typography variant="caption" color="info.main">
                  {scannerStats.progressPercentage}%
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h5" color="warning.main" fontWeight="600">
                {loading ? <CircularProgress size={24} /> : scannerStats.remainingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h5" color="success.main" fontWeight="600">
                {loading ? <CircularProgress size={24} /> : scannerStats.eligible}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eligible
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h5" color="error.main" fontWeight="600">
                {loading ? <CircularProgress size={24} /> : scannerStats.notEligible}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Not Eligible
              </Typography>
              {scannerStats.lastCycleDuration > 0 && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Last: {scannerStats.lastCycleDuration.toFixed(1)}s
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Scanner Logs */}
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon />
          Live Scanner Events
          <Badge badgeContent={scannerLogs.length} color="primary" />
        </Typography>
        
        <ScannerLogContainer>
          {scannerLogs.length === 0 ? (
            <Alert severity="info">
              {wsConnected 
                ? "Connected to scanner. Waiting for scanner activity..." 
                : "Connecting to scanner for real-time updates..."
              }
            </Alert>
          ) : (
            <List dense>
              {scannerLogs.map((log) => (
                <ListItem key={log.id} sx={{ py: 0.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {log.result === 'ELIGIBLE' ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : log.result === 'COMPLETED' ? (
                        <AnalyticsIcon color="info" fontSize="small" />
                      ) : log.result === 'INFO' ? (
                        <AccessTimeIcon color="primary" fontSize="small" />
                      ) : (
                        <CancelIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{log.instrument}</strong> - {log.step}: {log.result}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(log.timestamp).toLocaleTimeString()} - {log.message}
                          </Typography>
                          {log.details && (
                            <Box sx={{ mt: 0.5, p: 1, backgroundColor: 'grey.100', borderRadius: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Trend: {log.details.effectiveTrend} | R:R: {log.details.rewardRiskRatio?.toFixed(2)} | 
                                Action: {log.details.requiredAction} | Price: ${log.details.marketPrice?.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Support: ${log.details.supportPrice?.toFixed(2)} | 
                                Resistance: ${log.details.resistancePrice?.toFixed(2)} | 
                                Volume: {log.details.volume?.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </ScannerLogContainer>
      </CardContent>
    </Card>
  );
};

// Main Component
const LiveTradeSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [state, dispatch] = useReducer(stateReducer, initialState);

  // Initialize WebSocket connection
  const { connect, disconnect } = useWebSocket(sessionId, state.sessionData, dispatch);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LAST_UPDATE', payload: new Date() });
        
        // Fetch session details
        const sessionDetails = await apiServiceHelpers.getTradeSessionDetails(sessionId);
        dispatch({ type: 'SET_SESSION_DATA', payload: sessionDetails });

        // Fetch trades
        const trades = await apiServiceHelpers.getTrades(sessionId);
        dispatch({ type: 'SET_TRADES', payload: trades });

      } catch (error) {
        console.error('Error loading initial data:', error);
        // Handle error appropriately - maybe show error message
      }
    };

    if (sessionId) {
      loadInitialData();
    }
  }, [sessionId]);

  const handleBack = () => {
    navigate('/trade-management');
  };

  const handleRefresh = async () => {
    dispatch({ type: 'SET_LAST_UPDATE', payload: new Date() });
    
    try {
      // Refresh session details
      const sessionDetails = await apiServiceHelpers.getTradeSessionDetails(sessionId);
      dispatch({ type: 'SET_SESSION_DATA', payload: sessionDetails });

      // Refresh trades
      const trades = await apiServiceHelpers.getTrades(sessionId);
      dispatch({ type: 'SET_TRADES', payload: trades });

    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <LiveContainer>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs>
          <Link 
            underline="hover" 
            color="inherit" 
            href="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            Home
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/trade-management')}
            sx={{ cursor: 'pointer' }}
          >
            Trade Management
          </Link>
          <Typography color="text.primary">
            Live Trade Session #{sessionId}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <HeaderBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} color="primary">
            <BackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h4" component="h1" fontWeight="600">
                Live Trade Session #{sessionId}
              </Typography>
              <LiveBadge label="LIVE" size="small" />
              {state.sessionData && (
                <Chip 
                  label={`${state.sessionData.trading_frequency} | Algo ${state.sessionData.scanning_algorithm_id}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last updated: {state.lastUpdate.toLocaleTimeString()}
              {state.wsConnected && (
                <Chip 
                  label="Live Updates"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </HeaderBox>

      {/* Live Statistics */}
      <TradeStatistics 
        stats={state.sessionStats} 
        loading={state.loading.sessionStats} 
      />

      {/* Trade List Table */}
      <TradeTable 
        trades={state.trades}
        filters={state.filters}
        onFilterChange={handleFilterChange}
        loading={state.loading.trades}
      />

      {/* Scanner Section */}
      <ScannerSection 
        scannerStats={state.scannerStats}
        scannerLogs={state.scannerLogs}
        loading={state.loading.scannerStats}
        wsConnected={state.wsConnected}
      />
    </LiveContainer>
  );
};

export default LiveTradeSession; 