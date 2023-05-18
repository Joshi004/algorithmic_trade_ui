import React, { Component } from 'react';
import { w3cwebsocket as WebSocketClient } from 'websocket';

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
  }

  componentDidMount() {
    this.ws = new WebSocketClient('ws://127.0.0.1:8000/tmu/market');

    this.ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle received market update data and update UI or trigger trade actions.
    };
  }

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    return (
        <div>This is Trade Sesion</div>
    );
  }
}

export default TradeSession;
