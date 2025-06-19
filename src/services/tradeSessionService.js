import ENDPOINTS from './endpoints';
import apiService from './apiService';

/**
 * Trade Session Service - handles all trade session related API calls
 */
class TradeSessionService {
  
  /**
   * Pause a trade session
   * @param {string|number} sessionId - Trade session ID to pause
   * @returns {Promise} - API response with pause confirmation
   */
  static async pauseTradeSession(sessionId) {
    try {
      const response = await apiService.post(ENDPOINTS.TRADE_SESSIONS.PAUSE, {
        trade_session_id: sessionId
      });
      return response;
    } catch (error) {
      console.error('Error pausing trade session:', error);
      throw error;
    }
  }

  /**
   * Resume a trade session
   * @param {string|number} sessionId - Trade session ID to resume
   * @returns {Promise} - API response with resume confirmation
   */
  static async resumeTradeSession(sessionId) {
    try {
      const response = await apiService.post(ENDPOINTS.TRADE_SESSIONS.RESUME, {
        trade_session_id: sessionId
      });
      return response;
    } catch (error) {
      console.error('Error resuming trade session:', error);
      throw error;
    }
  }

  /**
   * Get trade session details
   * @param {string|number} sessionId - Trade session ID
   * @returns {Promise} - API response with session details
   */
  static async getTradeSessionDetails(sessionId) {
    try {
      const response = await apiService.get(`${ENDPOINTS.TRADE_SESSIONS.GET_DETAILS}?trade_session_id=${sessionId}`);
      return response;
    } catch (error) {
      console.error('Error fetching trade session details:', error);
      throw error;
    }
  }

  /**
   * Get user's trade sessions
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response with user's trade sessions
   */
  static async getUserTradeSessions(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${ENDPOINTS.TRADE_SESSIONS.GET_ALL}?${queryParams}` : ENDPOINTS.TRADE_SESSIONS.GET_ALL;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching user trade sessions:', error);
      throw error;
    }
  }

  /**
   * Get trade session parameter options
   * @returns {Promise} - API response with parameter options
   */
  static async getSessionParameterOptions() {
    try {
      const response = await apiService.get(ENDPOINTS.TRADE_SESSIONS.GET_PARAMS);
      return response;
    } catch (error) {
      console.error('Error fetching session parameter options:', error);
      throw error;
    }
  }

  /**
   * Initiate a new trade session
   * @param {Object} sessionData - Trade session configuration data
   * @param {string} sessionData.trading_frequency - Trading frequency for the session
   * @param {number} sessionData.dummy - Whether this is a dummy session (1) or live (0)
   * @param {string} sessionData.scanning_algorithm_name - Name of scanning algorithm
   * @param {string} sessionData.initiation_algorithm_name - Name of initiation algorithm
   * @param {string} sessionData.termination_algorithm_name - Name of termination algorithm
   * @returns {Promise} - API response with new session details
   */
  static async initiateTradeSession(sessionData) {
    try {
      const { 
        trading_frequency, 
        dummy, 
        scanning_algorithm_name,
        initiation_algorithm_name,
        termination_algorithm_name
      } = sessionData;

      const url = `${ENDPOINTS.TRADE_SESSIONS.INITIATE}?trading_frequency=${trading_frequency}&dummy=${dummy}&scanning_algorithm_name=${scanning_algorithm_name}&initiation_algorithm_name=${initiation_algorithm_name}&termination_algorithm_name=${termination_algorithm_name}`;
      
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      console.error('Error initiating trade session:', error);
      throw error;
    }
  }
}

export default TradeSessionService; 