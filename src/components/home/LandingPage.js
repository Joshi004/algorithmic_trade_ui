import {
  AccountBalance,
  Analytics,
  AutoGraph,
  Security,
  Speed,
  TrendingUp
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Advanced Trading Algorithms',
      description: 'Execute sophisticated trading strategies with our AI-powered algorithms designed for optimal market performance.'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Real-time Execution',
      description: 'Lightning-fast order execution with minimal latency to capture every market opportunity instantly.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Data-Driven Insights',
      description: 'Make informed decisions with comprehensive market analysis and predictive analytics.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with 99.9% uptime ensuring your trades are always protected and executed.'
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40 }} />,
      title: 'Portfolio Management',
      description: 'Intelligent portfolio optimization and risk management to maximize returns while minimizing exposure.'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Multi-Broker Support',
      description: 'Seamlessly integrate with multiple brokers including Zerodha, Upstox, and more for unified trading.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'transparent',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            <AutoGraph sx={{ mr: 1, verticalAlign: 'middle' }} />
            Algorithmic Trading System
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{ color: 'text.primary' }}
            >
              Sign In
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/signup')}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none'
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8}>
          <Chip 
            label="AI-Powered Trading Platform" 
            color="primary" 
            variant="outlined"
            sx={{ mb: 3, fontSize: '0.875rem' }}
          />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Transform Your Trading with AI
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Experience the future of algorithmic trading with our cutting-edge platform. 
            Execute complex strategies, manage risk intelligently, and maximize returns with 
            institutional-grade technology.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Start Trading Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Why Choose Our Platform?
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      color: 'primary.main', 
                      mb: 3,
                      '& svg': {
                        fontSize: '3rem'
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 'bold', mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box 
          textAlign="center" 
          sx={{ 
            py: 8,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderRadius: '24px',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Join thousands of traders who trust our platform for their algorithmic trading needs. 
            Sign up today and experience the difference.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ 
              py: 2, 
              px: 6,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            Join ATS Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 