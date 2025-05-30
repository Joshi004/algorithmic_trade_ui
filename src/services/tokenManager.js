import apiService from './apiService';

/**
 * TokenManager handles proactive token refresh with a 10% safety margin
 * If token expires in 60 seconds, it will refresh after 54 seconds (60 - 6)
 * Token expiry time is stored in session storage for persistence across page refreshes
 */
class TokenManager {
  constructor() {
    this.refreshTimeoutId = null;
    this.isRefreshing = false;
    this.onTokenExpired = null; // Callback for when token expires
    this.onTokenRefreshed = null; // Callback for when token is refreshed
    this.SAFETY_MARGIN_PERCENT = 10; // 10% safety margin
    this.SESSION_KEY = 'ats_token_expiry'; // Session storage key
  }

  /**
   * Set callbacks for token events
   */
  setCallbacks(onTokenExpired, onTokenRefreshed) {
    this.onTokenExpired = onTokenExpired;
    this.onTokenRefreshed = onTokenRefreshed;
  }

  /**
   * Store token expiry time in session storage
   */
  setTokenExpiryTime(expiryTime) {
    sessionStorage.setItem(this.SESSION_KEY, expiryTime.toString());
  }

  /**
   * Get token expiry time from session storage
   */
  getTokenExpiryTime() {
    const expiry = sessionStorage.getItem(this.SESSION_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  /**
   * Clear token expiry time from session storage
   */
  clearTokenExpiryTime() {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * Check if user is authenticated based on session storage
   */
  isAuthenticated() {
    const expiryTime = this.getTokenExpiryTime();
    if (!expiryTime) {
      return false;
    }
    return Date.now() < expiryTime;
  }

  /**
   * Start token management with expiry information from login/refresh response
   */
  startTokenManagement(tokenInfo) {
    console.log('TokenManager: Starting token management', tokenInfo);
    
    if (!tokenInfo || !tokenInfo.slt_expires_in_seconds) {
      console.error('TokenManager: Invalid token info provided');
      return;
    }

    // Clear any existing timeout
    this.clearRefreshTimeout();

    // Calculate when to refresh (with 10% safety margin)
    const expiresInMs = tokenInfo.slt_expires_in_seconds * 1000;
    const safetyMarginMs = (expiresInMs * this.SAFETY_MARGIN_PERCENT) / 100;
    const refreshAfterMs = expiresInMs - safetyMarginMs;

    // Store the actual expiry time in session storage
    const tokenExpiryTime = Date.now() + expiresInMs;
    this.setTokenExpiryTime(tokenExpiryTime);

    console.log(`TokenManager: SLT expires in ${expiresInMs / 1000} seconds`);
    console.log(`TokenManager: Will refresh after ${refreshAfterMs / 1000} seconds (${this.SAFETY_MARGIN_PERCENT}% margin)`);

    // Set timeout for proactive refresh
    this.refreshTimeoutId = setTimeout(() => {
      this.performProactiveRefresh();
    }, refreshAfterMs);
  }

  /**
   * Perform proactive token refresh
   */
  async performProactiveRefresh() {
    if (this.isRefreshing) {
      console.log('TokenManager: Refresh already in progress, skipping');
      return;
    }

    console.log('TokenManager: Performing proactive SLT refresh');
    this.isRefreshing = true;

    try {
      const response = await apiService.refreshToken();
      
      if (response && response.token_info) {
        console.log('TokenManager: SLT refreshed successfully');
        
        // Restart token management with new expiry
        this.startTokenManagement(response.token_info);
        
        // Notify callback
        if (this.onTokenRefreshed) {
          this.onTokenRefreshed(response.token_info);
        }
      } else {
        console.error('TokenManager: Refresh response missing token_info');
        this.handleRefreshFailure();
      }
    } catch (error) {
      console.error('TokenManager: SLT refresh failed', error);
      this.handleRefreshFailure();
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle refresh failure
   */
  handleRefreshFailure() {
    console.log('TokenManager: SLT refresh failed, user needs to re-login');
    this.clearRefreshTimeout();
    
    if (this.onTokenExpired) {
      this.onTokenExpired();
    }
  }

  /**
   * Stop token management
   */
  stopTokenManagement() {
    console.log('TokenManager: Stopping SLT management');
    this.clearRefreshTimeout();
    this.clearTokenExpiryTime();
  }

  /**
   * Clear refresh timeout
   */
  clearRefreshTimeout() {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  }

  /**
   * Check if token is expired based on stored expiry time
   */
  isTokenExpired() {
    const expiryTime = this.getTokenExpiryTime();
    if (!expiryTime) {
      return true; // No token info means expired
    }
    return Date.now() >= expiryTime;
  }

  /**
   * Get time until token expires (in seconds)
   */
  getTimeUntilExpiry() {
    const expiryTime = this.getTokenExpiryTime();
    if (!expiryTime) {
      return 0;
    }
    const timeLeft = Math.max(0, expiryTime - Date.now());
    return Math.floor(timeLeft / 1000);
  }

  /**
   * Manual refresh trigger (for testing or emergency refresh)
   */
  async manualRefresh() {
    console.log('TokenManager: Manual SLT refresh triggered');
    return this.performProactiveRefresh();
  }
}

// Export singleton instance
const tokenManager = new TokenManager();
export default tokenManager; 