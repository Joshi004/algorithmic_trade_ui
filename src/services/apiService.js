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

    try {
      const response = await fetch(getApiUrl(ENDPOINTS.AUTH.REFRESH_TOKEN), {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // The new short-lived token is set as a cookie by the server
        this.processQueue(null, 'refreshed');
        return true;
      } else {
        const error = new Error('Token refresh failed');
        this.processQueue(error, null);
        // Automatically redirect to login when refresh fails
        setTimeout(() => this.redirectToLogin(), 100);
        return false;
      }
    } catch (error) {
      this.processQueue(error, null);
      // Automatically redirect to login when refresh fails
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
      const response = await fetch(getApiUrl(endpoint), requestOptions);
      
      // If we get a 401 and this endpoint requires auth, try to refresh token
      if (response.status === 401 && this.requiresAuth(endpoint)) {
        const refreshSuccess = await this.refreshToken();
        
        if (refreshSuccess) {
          // Retry the original request
          const retryResponse = await fetch(getApiUrl(endpoint), requestOptions);
          return await this.handleResponse(retryResponse);
        } else {
          // Refresh failed - error will be thrown and login redirect already happened
          throw new Error('Authentication failed - redirecting to login');
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
      const error = await response.json().catch(() => {
        return { message: response.statusText };
      });
      
      throw new Error(error.message || error.error || 'An error occurred while processing the request');
    }
    
    return await response.json();
  }

  /**
   * Login method that handles token storage in cookies
   * @param {Object} credentials - Email and password
   * @returns {Promise} - Login response
   */
  async login(credentials) {
    const response = await fetch(getApiUrl(ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => {
        return { message: response.statusText };
      });
      throw new Error(error.message || error.error || 'Login failed');
    }

    const data = await response.json();
    
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