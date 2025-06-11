import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import ENDPOINTS from '../../services/endpoints';
import apiService from '../../services/apiService';
import toastService from '../../services/toastService';
import { useNavigate } from 'react-router-dom';

const BrokerRegistration = () => {
  const [formData, setFormData] = useState({
    broker_name: 'zerodha',
    api_key: '',
    api_secret: ''
  });
  const [loading, setLoading] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Dismiss any existing toasts when user starts typing
    toastService.dismissAll();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toastService.dismissAll();

    try {
      // Validate form data
      if (!formData.api_key || !formData.api_secret) {
        toastService.error('Please fill in all required fields', 'Missing Information');
        setLoading(false);
        return;
      }

      // Call broker registration API
      const response = await apiService.post(ENDPOINTS.BROKER.REGISTER, formData);
      
      console.log('Broker registration successful:', response);
      toastService.success('Broker credentials registered successfully! Redirecting...', 'Registration Successful', 3000);
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (err) {
      console.error('Broker registration error:', err);
      toastService.error(err.message || 'Failed to register broker credentials. Please try again.', 'Registration Failed');
      setLoading(false);
    }
  };

  const handleToggleApiSecret = () => {
    setShowApiSecret(!showApiSecret);
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Broker Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Register your broker credentials to enable trading functionality
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="broker-name-label">Broker</InputLabel>
                <Select
                  labelId="broker-name-label"
                  id="broker_name"
                  name="broker_name"
                  value={formData.broker_name}
                  label="Broker"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="zerodha">Zerodha</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="api_key"
                label="API Key"
                name="api_key"
                type="text"
                autoComplete="off"
                value={formData.api_key}
                onChange={handleChange}
                disabled={loading}
                helperText="Your broker API key for trading access"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="api_secret"
                label="API Secret"
                type={showApiSecret ? "text" : "password"}
                id="api_secret"
                autoComplete="off"
                value={formData.api_secret}
                onChange={handleChange}
                disabled={loading}
                helperText="Your broker API secret (kept secure)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle API secret visibility"
                        onClick={handleToggleApiSecret}
                        edge="end"
                        disabled={loading}
                      >
                        {showApiSecret ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Register Broker'
                  )}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default BrokerRegistration; 