import ENDPOINTS from './endpoints';
import apiService from './apiService';

/**
 * Service for handling Kite/Zerodha integration
 */
class KiteService {
  /**
   * Get login URL for Kite authentication
   * Handles the case where broker credentials don't exist
   * @returns {Promise<Object>} - Response with login URL or error
   */
  async getLoginUrl() {
    try {
      const response = await apiService.get(ENDPOINTS.KITE.GET_LOGIN_URL);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Get login URL error:', error);
      
      // Check if this is a "no broker credentials" error using the error code
      if (error.errorCode === 'NO_BROKER_CREDENTIALS' || 
          (error.message && (
            error.message.includes('No broker credentials found') ||
            error.message.includes('NO_BROKER_CREDENTIALS')
          ))) {
        return {
          success: false,
          error: 'NO_BROKER_CREDENTIALS',
          message: 'Please register your broker credentials first',
          redirectTo: 'broker_registration'
        };
      }
      
      return {
        success: false,
        error: 'GENERAL_ERROR',
        message: error.message || 'Failed to get login URL'
      };
    }
  }

  /**
   * Set session using request token from Kite
   * @param {string} requestToken - The request token from Kite callback
   * @returns {Promise<Object>} - Response from session setup
   */
  async setSession(requestToken) {
    try {
      const response = await apiService.post(ENDPOINTS.KITE.SET_SESSION, {
        request_token: requestToken
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Set session error:', error);
      return {
        success: false,
        error: 'SESSION_ERROR',
        message: error.message || 'Failed to set session'
      };
    }
  }

  /**
   * Get profile information from Kite
   * @returns {Promise<Object>} - Profile information
   */
  async getProfileInfo() {
    try {
      const response = await apiService.get(ENDPOINTS.KITE.GET_PROFILE_INFO);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Get profile info error:', error);
      return {
        success: false,
        error: 'PROFILE_ERROR',
        message: error.message || 'Failed to get profile information'
      };
    }
  }

  /**
   * Handle the complete Kite login flow
   * @returns {Promise<Object>} - Result of the login flow
   */
  async initiateKiteLogin() {
    const result = await this.getLoginUrl();
    
    if (!result.success) {
      return result;
    }
    
    // If we have a login URL, redirect to it
    if (result.data && result.data.login_url) {
      window.location.href = result.data.login_url;
      return {
        success: true,
        message: 'Redirecting to Kite login...'
      };
    }
    
    return {
      success: false,
      error: 'INVALID_RESPONSE',
      message: 'Invalid response from login URL endpoint'
    };
  }
}

// Create and export a singleton instance
const kiteService = new KiteService();
export default kiteService; 