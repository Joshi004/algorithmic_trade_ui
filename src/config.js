// Environment configurations for API endpoints
const ENV = process.env.REACT_APP_ENV || 'development';

// Configuration for different environments
const environments = {
  development: {
    // Use relative paths in development - React proxy will handle backend routing
    apiBaseUrl: '',
    // WebSocket URLs need absolute URLs even in development (proxy doesn't work for WS)
    wsBaseUrl: 'ws://localhost:18000',
  },
  testing: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://test-api.algorithmic-trade.example',
    wsBaseUrl: process.env.REACT_APP_WS_URL || 'ws://test-api.algorithmic-trade.example',
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://api.algorithmic-trade.example',
    wsBaseUrl: process.env.REACT_APP_WS_URL || 'wss://api.algorithmic-trade.example',
  }
};

// Select the current environment config
const config = environments[ENV];

// Export a function to get the complete API URL
export const getApiUrl = (endpoint) => {
  // Make sure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In development with proxy, use relative paths
  if (ENV === 'development' && !config.apiBaseUrl) {
    return normalizedEndpoint;
  }
  
  return `${config.apiBaseUrl}${normalizedEndpoint}`;
};

// Export a function to get the complete WebSocket URL
export const getWsUrl = (endpoint) => {
  // Make sure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${config.wsBaseUrl}${normalizedEndpoint}`;
};

// Export the base configuration
export default config; 