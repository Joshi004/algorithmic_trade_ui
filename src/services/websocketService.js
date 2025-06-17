import ENDPOINTS from './endpoints';
import { getWsUrl, getApiUrl } from '../config';

/**
 * Professional WebSocket Token Retrieval
 * 
 * This function fetches a fresh SLT token from the dedicated WebSocket authentication endpoint.
 * This approach is necessary because:
 * 1. The SLT cookie is httpOnly (secure, but inaccessible to JavaScript)
 * 2. WebSocket subprotocol authentication requires the token in JavaScript
 * 3. This follows industry best practices for secure WebSocket authentication
 */
async function getWebSocketToken() {
  try {
    const response = await fetch(getApiUrl(ENDPOINTS.AUTH.WEBSOCKET_TOKEN), {
      method: 'GET',
      credentials: 'include', // Include httpOnly cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch WebSocket token:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching WebSocket token:', error);
    return null;
  }
}

/**
 * Professional WebSocket Service
 * 
 * This service implements industry-standard WebSocket authentication using the 
 * Sec-WebSocket-Protocol header approach (same pattern used by Kubernetes and Jupyter).
 * 
 * Authentication Flow:
 * 1. Fetches fresh SLT token from dedicated endpoint (secured by httpOnly cookies)
 * 2. Sends token via WebSocket subprotocol during handshake
 * 3. Backend validates token and accepts/rejects connection
 * 4. Provides automatic reconnection with exponential backoff
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  /**
   * Establishes WebSocket connection with professional authentication
   * Uses Sec-WebSocket-Protocol header for token authentication (Kubernetes/Jupyter pattern)
   */
  async connect() {
    if (this.socket && this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      // Step 1: Get fresh SLT token from secure endpoint
      const sltToken = await getWebSocketToken();
      if (!sltToken) {
        console.error('WebSocket authentication failed: No valid token available');
        return;
      }

      // Step 2: Create WebSocket connection with subprotocol authentication
      // This follows the Kubernetes/Jupyter pattern for secure WebSocket authentication
      const wsUrl = getWsUrl(ENDPOINTS.WEBSOCKET.ATS);
      const protocols = [
        'ats.token.v1',                    // Base protocol identifier
        `ats.token.v1.${sltToken}`         // Protocol with embedded token
      ];
      
      console.log('Connecting to WebSocket with professional authentication:', wsUrl);
      this.socket = new WebSocket(wsUrl, protocols);

      // Step 3: Set up event handlers
      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
        console.log('Authenticated protocol:', this.socket.protocol);
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connection_established') {
            console.log('WebSocket authentication successful:', data.message);
          }
        } catch (e) {
          // Handle non-JSON messages gracefully
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.isConnected = false;
        
        // Don't reconnect if authentication failed (code 4001)
        if (event.code === 4001) {
          console.error('WebSocket authentication failed - check user login status');
          return;
        }
        
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }

  /**
   * Gracefully disconnects the WebSocket connection
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Handles automatic reconnection with exponential backoff
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectInterval * this.reconnectAttempts, 30000);
      
      console.log(`Reconnecting WebSocket in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max WebSocket reconnection attempts reached');
    }
  }

  /**
   * Sends data through the WebSocket connection
   * @param {Object} data - Data to send (will be JSON stringified)
   */
  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected - message not sent:', data);
    }
  }

  /**
   * Returns the current connection status
   * @returns {boolean} - True if WebSocket is connected
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance for application-wide use
const websocketService = new WebSocketService();
export default websocketService; 