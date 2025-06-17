import React, { Component } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
  ArrowBack as BackIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  ShowChart as ShowChartIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';

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

class LiveTradeSessionInner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveData: this.generateMockLiveData(),
      lastUpdate: new Date(),
    };
  }

  componentDidMount() {
    // Simulate live updates every 5 seconds
    this.liveUpdateInterval = setInterval(() => {
      this.setState({
        liveData: this.generateMockLiveData(),
        lastUpdate: new Date(),
      });
    }, 5000);
  }

  componentWillUnmount() {
    if (this.liveUpdateInterval) {
      clearInterval(this.liveUpdateInterval);
    }
  }

  generateMockLiveData = () => {
    // Generate realistic mock data for live trading session
    const baseProfit = Math.random() * 2000 - 1000; // -1000 to +1000
    return {
      currentProfit: baseProfit,
      totalTrades: Math.floor(Math.random() * 50) + 10,
      activeTrades: Math.floor(Math.random() * 5) + 1,
      successRate: Math.random() * 40 + 50, // 50-90%
      recentTrades: this.generateRecentTrades(),
      marketActivity: {
        instrumentsScanned: Math.floor(Math.random() * 100) + 50,
        signalsGenerated: Math.floor(Math.random() * 20) + 5,
        ordersFilled: Math.floor(Math.random() * 15) + 2,
      }
    };
  };

  generateRecentTrades = () => {
    const instruments = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META'];
    const trades = [];
    
    for (let i = 0; i < 8; i++) {
      const isProfit = Math.random() > 0.4;
      const profit = isProfit 
        ? Math.random() * 200 + 10 
        : -(Math.random() * 150 + 5);
      
      trades.push({
        id: i + 1,
        instrument: instruments[Math.floor(Math.random() * instruments.length)],
        type: Math.random() > 0.5 ? 'LONG' : 'SHORT',
        quantity: Math.floor(Math.random() * 100) + 10,
        entry: (Math.random() * 500 + 50).toFixed(2),
        exit: profit > 0 ? 'CLOSED' : 'ACTIVE',
        profit: profit,
        time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(), // Random time in last hour
      });
    }
    
    return trades.sort((a, b) => b.id - a.id);
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  render() {
    const { sessionId, navigate } = this.props;
    const { liveData, lastUpdate } = this.state;

    const handleBack = () => {
      navigate('/trade-management');
    };

    const handleRefresh = () => {
      this.setState({
        liveData: this.generateMockLiveData(),
        lastUpdate: new Date(),
      });
    };

    return (
      <LiveContainer>
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
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </HeaderBox>

        {/* Live Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 40, color: liveData.currentProfit >= 0 ? 'success.main' : 'error.main', mb: 1 }} />
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: liveData.currentProfit >= 0 ? 'success.main' : 'error.main',
                  mb: 1
                }}>
                  {this.formatCurrency(liveData.currentProfit)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current P&L
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShowChartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  {liveData.totalTrades}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Trades
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                  {liveData.activeTrades}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Trades
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>

          <Grid item xs={12} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                  {liveData.successRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Success Rate
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Market Activity */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon />
              Market Activity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="primary.main" fontWeight="600">
                    {liveData.marketActivity.instrumentsScanned}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instruments Scanned
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="success.main" fontWeight="600">
                    {liveData.marketActivity.signalsGenerated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Signals Generated
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="warning.main" fontWeight="600">
                    {liveData.marketActivity.ordersFilled}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders Filled
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Trades Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShowChartIcon />
              Recent Trades
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Instrument</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Entry Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">P&L</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {liveData.recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.time}</TableCell>
                      <TableCell>
                        <Typography fontWeight="600">{trade.instrument}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={trade.type}
                          size="small"
                          color={trade.type === 'LONG' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">{trade.quantity}</TableCell>
                      <TableCell align="right">${trade.entry}</TableCell>
                      <TableCell>
                        <Chip 
                          label={trade.exit}
                          size="small"
                          color={trade.exit === 'ACTIVE' ? 'warning' : 'default'}
                          variant={trade.exit === 'ACTIVE' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          gap: 0.5
                        }}>
                          {trade.profit >= 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                          <Typography 
                            fontWeight="600"
                            color={trade.profit >= 0 ? 'success.main' : 'error.main'}
                          >
                            {this.formatCurrency(trade.profit)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </LiveContainer>
    );
  }
}

// Wrapper component to handle React Router hooks
const LiveTradeSession = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  return <LiveTradeSessionInner sessionId={sessionId} navigate={navigate} />;
};

export default LiveTradeSession; 