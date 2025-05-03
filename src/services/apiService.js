import { getApiUrl } from '../config';

/**
 * API Service for making HTTP requests to the backend
 */
class ApiService {
  /**
   * Gets the full API URL for an endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {string} - The complete API URL
   */
  getApiUrl(endpoint) {
    return getApiUrl(endpoint);
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - The response data
   */
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  /**
   * Makes a POST request to the specified endpoint
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} data - The data to send in the request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - The response data
   */
  async post(endpoint, data, options = {}) {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
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
      
      throw new Error(error.message || 'An error occurred while processing the request');
    }
    
    return await response.json();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 