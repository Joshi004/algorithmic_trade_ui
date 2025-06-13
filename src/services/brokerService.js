import ENDPOINTS from './endpoints';
import apiService from './apiService';

/**
 * Service for handling broker management and Kite/Zerodha integration operations
 */
class BrokerService {
  /**
   * Check if user has registered broker credentials
   * @returns {Promise<Object>} - Response with broker registration status
   */
  async checkBrokerRegistrationStatus() {
    try {
      const response = await apiService.get(ENDPOINTS.BROKER.GET_USER_BROKERS);
      console.log('Broker service - API response:', response);
      
      // Handle different response formats
      let isRegistered = false;
      if (response) {
        // Check multiple possible response formats
        if (response.brokers && Array.isArray(response.brokers) && response.brokers.length > 0) {
          isRegistered = true;
        } else if (Array.isArray(response) && response.length > 0) {
          isRegistered = true;
        } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          isRegistered = true;
        }
      }
      
      console.log('Broker service - isRegistered:', isRegistered);
      
      return {
        success: true,
        isRegistered,
        data: response
      };
    } catch (error) {
      console.error('Check broker registration status error:', error);
      
      // If no brokers found or 404, it's still a successful check but not registered
      if (error.message && (
        error.message.includes('No brokers found') || 
        error.message.includes('404') ||
        error.status === 404
      )) {
        return {
          success: true,
          isRegistered: false,
          data: null
        };
      }
      
      return {
        success: false,
        isRegistered: false,
        error: error.message || 'Failed to check broker registration status'
      };
    }
  }

  /**
   * Register broker credentials
   * @param {Object} brokerData - Broker credentials data
   * @returns {Promise<Object>} - Response from broker registration
   */
  async registerBroker(brokerData) {
    try {
      const response = await apiService.post(ENDPOINTS.BROKER.REGISTER, brokerData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Broker registration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to register broker credentials'
      };
    }
  }

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

const brokerService = new BrokerService();
export default brokerService; 