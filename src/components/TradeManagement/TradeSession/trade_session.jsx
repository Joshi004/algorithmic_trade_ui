import React, { Component } from 'react';
import { w3cwebsocket as WebSocketClient } from 'websocket';

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      price:0
    }
  }

  componentDidMount() {
    this.ws = new WebSocketClient('ws://127.0.0.1:8000/ws/initiate_trade_session/?trading_symbol=INFY&exchange=nse&algorithm=just_macd&');

    this.ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("new Price",data)

      this.setState({"price":data.price})
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
        <div>This is Trade Sesion 
          <h3>Current Price :  {this.state.price} </h3>
        </div>
    );
  }
}

export default TradeSession;
