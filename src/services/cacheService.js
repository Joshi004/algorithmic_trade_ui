/**
 * Cache Service for managing cached data with expiration
 */
class CacheService {
  constructor() {
    this.CACHE_KEYS = {
      TRADE_SESSION_PARAMS: 'trade_session_params',
    };
    
    // Cache expiration times (in milliseconds)
    this.CACHE_TTL = {
      TRADE_SESSION_PARAMS: 30 * 60 * 1000, // 30 minutes
    };
  }

  /**
   * Set cached data with expiration time
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, data, ttl = null) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.CACHE_TTL[key] || 0,
      };
      
      localStorage.setItem(key, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get cached data if not expired
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if expired/not found
   */
  get(key) {
    try {
      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) {
        return null;
      }

      const cacheData = JSON.parse(cachedItem);
      const now = Date.now();
      
      // Check if cache has expired
      if (cacheData.ttl > 0 && (now - cacheData.timestamp) > cacheData.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Check if cached data exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if valid cache exists
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Remove cached data
   * @param {string} key - Cache key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Cache remove error:', error);
      return false;
    }
  }

  /**
   * Clear all cached data
   */
  clear() {
    try {
      Object.values(this.CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get trade session parameters from cache
   * @returns {Object|null} - Cached session parameters or null
   */
  getTradeSessionParams() {
    return this.get(this.CACHE_KEYS.TRADE_SESSION_PARAMS);
  }

  /**
   * Set trade session parameters in cache
   * @param {Object} params - Session parameters to cache
   * @returns {boolean} - True if successful
   */
  setTradeSessionParams(params) {
    return this.set(this.CACHE_KEYS.TRADE_SESSION_PARAMS, params);
  }

  /**
   * Check if trade session parameters are cached
   * @returns {boolean} - True if cached and not expired
   */
  hasTradeSessionParams() {
    return this.has(this.CACHE_KEYS.TRADE_SESSION_PARAMS);
  }

  /**
   * Remove trade session parameters from cache
   */
  removeTradeSessionParams() {
    return this.remove(this.CACHE_KEYS.TRADE_SESSION_PARAMS);
  }
}

// Export a singleton instance
const cacheService = new CacheService();
export default cacheService; 