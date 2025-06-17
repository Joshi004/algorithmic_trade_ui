import ENDPOINTS from './endpoints';
import { getWsUrl } from '../config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  connect() {
    if (this.socket && this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      // Use the WebSocket endpoint from centralized configuration
      // WebSocket will automatically include cookies from the same domain
      const wsUrl = getWsUrl(ENDPOINTS.WEBSOCKET.ATS);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connection_established') {
            console.log('WebSocket authentication successful:', data);
          }
        } catch (e) {
          console.log('WebSocket message (non-JSON):', event.data);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.isConnected = false;
        
        // Don't reconnect if authentication failed (code 4001)
        if (event.code === 4001) {
          console.error('WebSocket authentication failed - not attempting reconnect');
          return;
        }
        
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      console.log('WebSocket disconnected');
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached. WebSocket connection failed.');
    }
  }

  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected. Message not sent:', data);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 