import ENDPOINTS from './endpoints';
import { getApiUrl } from '../config';

/**
 * API Service for making HTTP requests to the backend
 */
class ApiService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  /**
   * Gets the full API URL for an endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {string} - The complete API URL
   */
  getApiUrl(endpoint) {
    return getApiUrl(endpoint);
  }

  /**
   * Redirect to login page
   */
  redirectToLogin() {
    // Use window.location to force a full page reload
    // This clears any existing state and ensures clean login
    window.location.href = '/login';
  }

  /**
   * Log current cookies for debugging
   */
  logCookies() {
    // Note: We can't read HTTP-only cookies in JavaScript, but we can see what's sent
    console.log('Document cookies (non-HTTP-only only):', document.cookie);
    console.log('User agent:', navigator.userAgent);
  }

  /**
   * Process the queue of failed requests after token refresh
   * @param {Error|null} error - Error if refresh failed
   * @param {string|null} token - New token if refresh succeeded
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * Refresh the access token using the long-lived token
   * @returns {Promise<boolean>} - True if refresh succeeded
   */
  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    console.log('Attempting to refresh token...');
    this.logCookies();

    try {
      const response = await fetch(getApiUrl(ENDPOINTS.AUTH.REFRESH_TOKEN), {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Refresh token response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Token refresh successful:', data);
        // The new short-lived token is set as a cookie by the server
        this.processQueue(null, 'refreshed');
        return true;
      } else {
        const errorText = await response.text();
        console.log('Token refresh failed:', response.status, errorText);
        const error = new Error(`Token refresh failed: ${response.status}`);
        this.processQueue(error, null);
        // Only redirect on actual token refresh failures, not on individual API failures
        if (response.status === 401 || response.status === 403) {
          setTimeout(() => this.redirectToLogin(), 100);
        }
        return false;
      }
    } catch (error) {
      console.error('Token refresh network error:', error);
      this.processQueue(error, null);
      // Only redirect on network errors during token refresh
      setTimeout(() => this.redirectToLogin(), 100);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if an endpoint requires authentication
   * @param {string} endpoint - The API endpoint
   * @returns {boolean} - True if authentication is required
   */
  requiresAuth(endpoint) {
    const publicEndpoints = ['login', 'register'];
    return !publicEndpoints.some(publicEndpoint => endpoint.includes(publicEndpoint));
  }

  /**
   * Check if an endpoint is critical for authentication
   * @param {string} endpoint - The API endpoint
   * @returns {boolean} - True if this endpoint failure should trigger redirect
   */
  isCriticalAuthEndpoint(endpoint) {
    const criticalEndpoints = ['refresh-token', 'logout'];
    return criticalEndpoints.some(criticalEndpoint => endpoint.includes(criticalEndpoint));
  }

  /**
   * Check if an endpoint is the Kite profile endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {boolean} - True if this is the Kite profile endpoint
   */
  isKiteProfileEndpoint(endpoint) {
    return endpoint.includes('get_profile_info');
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - The response data
   */
  async get(endpoint, options = {}) {
    return this.makeRequest(endpoint, {
      method: 'GET',
      ...options
    });
  }

  /**
   * Makes a POST request to the specified endpoint
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send in the request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - The response data
   */
  async post(endpoint, data, options = {}) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * Makes a request with automatic token refresh on 401 errors
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Fetch options
   * @returns {Promise} - The response data
   */
  async makeRequest(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const requestOptions = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      ...options
    };

    try {
      console.log(`Making API request to: ${endpoint}`);
      console.log('Request options:', {
        method: options.method || 'GET',
        credentials: requestOptions.credentials,
        headers: requestOptions.headers
      });
      this.logCookies();
      
      const response = await fetch(getApiUrl(endpoint), requestOptions);
      console.log(`API response status for ${endpoint}:`, response.status);
      
      // If we get a 401 and this endpoint requires auth, try to refresh token
      if (response.status === 401 && this.requiresAuth(endpoint)) {
        console.log(`Got 401 for ${endpoint}, attempting token refresh...`);
        
        // Special handling for Kite profile endpoint - don't redirect on failure
        if (this.isKiteProfileEndpoint(endpoint)) {
          console.log('Kite profile endpoint failed - this is expected if not connected to Zerodha');
          // Just throw the error, don't try to refresh
          throw new Error('Kite profile not available - user not connected to Zerodha');
        }
        
        const refreshSuccess = await this.refreshToken();
        
        if (refreshSuccess) {
          console.log(`Token refresh successful, retrying ${endpoint}`);
          // Retry the original request
          const retryResponse = await fetch(getApiUrl(endpoint), requestOptions);
          return await this.handleResponse(retryResponse);
        } else {
          console.log(`Token refresh failed for ${endpoint}`);
          // Only redirect if this is a critical auth endpoint or if refresh completely failed
          if (this.isCriticalAuthEndpoint(endpoint)) {
            setTimeout(() => this.redirectToLogin(), 100);
          }
          // For non-critical endpoints, just throw the error and let the component handle it
          throw new Error('Authentication failed - please login again');
        }
      }
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * Handles the API response and error cases
   * @param {Response} response - The fetch Response object
   * @returns {Promise} - The parsed response data
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        return { message: response.statusText };
      });
      
      // Create an error with the message
      const errorMessage = errorData.message || errorData.error || 'An error occurred while processing the request';
      const error = new Error(errorMessage);
      
      // Preserve structured error information
      error.errorCode = errorData.error_code;
      error.errorData = errorData;
      
      throw error;
    }
    
    return await response.json();
  }

  /**
   * Login method that handles token storage in cookies
   * @param {Object} credentials - Email and password
   * @returns {Promise} - Login response
   */
  async login(credentials) {
    console.log('Attempting login...');
    this.logCookies();
    
    const response = await fetch(getApiUrl(ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => {
        return { message: response.statusText };
      });
      throw new Error(error.message || error.error || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    
    // Log cookies after login (though we can't see HTTP-only ones)
    console.log('After login - cookies should be set by server');
    this.logCookies();
    
    // Tokens are stored in HTTP-only cookies by the server
    // The frontend just receives the response with user info
    return data;
  }

  /**
   * Logout method that clears authentication
   */
  async logout() {
    try {
      await fetch(getApiUrl(ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always redirect to login after logout, regardless of success/failure
      this.redirectToLogin();
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 