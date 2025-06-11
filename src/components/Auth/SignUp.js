import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Container,
  Grid,
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

import toastService from '../../services/toastService';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
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
    
    // Dismiss any existing toasts when user starts typing
    toastService.dismissAll();

    // Show password rules when user starts typing password
    if (name === 'password' && value.length > 0 && !showPasswordRules) {
      setShowPasswordRules(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toastService.dismissAll();

    try {
      // Frontend validation
      if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
        toastService.error('Please fill in all required fields', 'Missing Information');
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toastService.error('Please enter a valid email address', 'Invalid Email');
        setLoading(false);
        return;
      }

      // Password validation
      if (!validatePassword(formData.password)) {
        toastService.error('Password does not meet the security requirements', 'Weak Password');
        setLoading(false);
        return;
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        toastService.error('Passwords do not match', 'Password Mismatch');
        setLoading(false);
        return;
      }

      // Call registration through auth context
      const response = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', response);
      toastService.success('Account created successfully! Redirecting to login...', 'Registration Successful', 3000);
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setShowPasswordRules(false);
      
      // Set navigation loading state
      setLoading(false);
      setIsNavigating(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      console.error('Registration error:', err);
      toastService.error(err.message || 'Registration failed. Please try again.', 'Registration Failed');
      setLoading(false);
    }
  };

  const isFormDisabled = loading || isNavigating;

  return (
    <>
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
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* First Name Field - Full Width */}

                  <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                /></Grid>
                
                {/* Last Name and Email Fields - Side by Side */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                    />
                  </Grid>

                
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      type="email"
                      sx={{ mt: 2 }}
                    />
                  </Grid>

                
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                  error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                  helperText={
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                />

                {/* Password Requirements */}
                <Collapse in={showPasswordRules && !isNavigating}>
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
                  disabled={isFormDisabled}
                  size="large"
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Creating Account...
                    </>
                  ) : isNavigating ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Redirecting to Login...
                    </>
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

      {/* Full Page Loading Overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isNavigating}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" color="inherit">
          Account Created Successfully!
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
          Redirecting you to the login page...
        </Typography>
      </Backdrop>
    </>
  );
};

export default SignUp; 