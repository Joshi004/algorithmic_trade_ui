// Environment configurations for API endpoints
const ENV = process.env.REACT_APP_ENV || 'development';

// Configuration for different environments
const environments = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://127.0.0.1:18000',
  },
  testing: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://test-api.algorithmic-trade.example',
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://api.algorithmic-trade.example',
  }
};

// Select the current environment config
const config = environments[ENV];

// Export a function to get the complete API URL
export const getApiUrl = (endpoint) => {
  // Make sure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${config.apiBaseUrl}${normalizedEndpoint}`;
};

// Export the base configuration
export default config; 