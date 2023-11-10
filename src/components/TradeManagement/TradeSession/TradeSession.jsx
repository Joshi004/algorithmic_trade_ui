import React, { Component } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";
import { Button, Icon } from "semantic-ui-react";
import "./TradeSession.scss";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      price: 0,
    };
  }

  initiateTradeSession = () => {
    this.ws = new WebSocketClient(
      "ws://127.0.0.1:8000/ws/initiate_trade_session/?trading_symbol=INFY&exchange=nse&scanning_algorithm=udts&tracking_algorithm=slto"
    );

    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("new Price", data);

      this.setState({ price: data.price });
    };
  };

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    return (
      <div className="trade-session">
        <Button
          primary
          className="init-button"
          onClick={this.initiateTradeSession}
        >
          New Session <Icon name="plus" className="plus-icon" />
        </Button>
      </div>
    );
  }
}

export default TradeSession;
