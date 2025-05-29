import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  TextField,
  Typography
} from '@mui/material';
import { Cancel, CheckCircle, Info } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Password validation rules
  const passwordRules = [
    {
      id: 'length',
      text: 'At least 8 characters long',
      validate: (password) => password.length >= 8
    },
    {
      id: 'uppercase',
      text: 'At least one uppercase letter (A-Z)',
      validate: (password) => /[A-Z]/.test(password)
    },
    {
      id: 'digit',
      text: 'At least one numeric digit (0-9)',
      validate: (password) => /[0-9]/.test(password)
    },
    {
      id: 'special',
      text: 'At least one special character (!@#$%^&*(),.?":{}|<>)',
      validate: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];

  const validatePassword = (password) => {
    return passwordRules.every(rule => rule.validate(password));
  };

  const getPasswordRuleStatus = (rule) => {
    return rule.validate(formData.password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }

    // Show password rules when user starts typing password
    if (name === 'password' && value.length > 0 && !showPasswordRules) {
      setShowPasswordRules(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Frontend validation
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Password validation
      if (!validatePassword(formData.password)) {
        setError('Password does not meet the security requirements');
        setLoading(false);
        return;
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Call registration through auth context
      const response = await register({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', response);
      setSuccess('Account created successfully! You can now sign in.');
      
      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      setShowPasswordRules(false);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Create your account to start trading
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                type="email"
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                onFocus={() => setShowPasswordRules(true)}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                helperText={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
              />

              {/* Password Requirements */}
              <Collapse in={showPasswordRules}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Info sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                      Password Requirements:
                    </Typography>
                  </Box>
                  <List dense sx={{ pl: 2 }}>
                    {passwordRules.map((rule) => {
                      const isValid = getPasswordRuleStatus(rule);
                      return (
                        <ListItem key={rule.id} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {isValid ? (
                              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={rule.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: isValid ? 'success.main' : 'text.secondary'
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              </Collapse>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                size="large"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign Up'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink component={Link} to="/login" underline="hover">
                    Sign In
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SignUp; 