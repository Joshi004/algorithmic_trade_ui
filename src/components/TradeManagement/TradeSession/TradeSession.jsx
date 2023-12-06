import React, { Component } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";
import { Button, Icon, Modal } from "semantic-ui-react";
import TradeSessionForm from "./TradeSessionGrid/TradeSessionForm/TradeSessionForm";
import TradeSessionGrid from "./TradeSessionGrid/TradeSessionGrid";
import "./TradeSession.scss";
import TradeSessionDetail from "./TradeSessionDetail/TradeSessionDetail";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      selectedSessionId: null,
    };
  }

  initiateCommunicationChannal = (tradeSessionID) => {
    console.log("Initiate Communication Channal");
    this.ws = new WebSocketClient(
      `ws://127.0.0.1:8000/ws/setup_trade_session_commnication/?trade_session_id=${tradeSessionID}`
    );

    this.ws.onopen = () => {
      console.log(`Connection Establish for SessionID : ${tradeSessionID}`);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
  };

  updateselectedSessionId = (selectedSessionId) => {
    console.log("Selected Trade Session", selectedSessionId);
    this.setState({ selectedSessionId });
  };

  handleMessage = (data) => {
    console.log("Handle new message ", data);
  };

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    const { selectedSessionId } = this.state;
    return (
      <div className="trade-session">
        {selectedSessionId ? (
          <TradeSessionDetail tradeSessionID={selectedSessionId} />
        ) : (
          <div className="trade-session">
            <TradeSessionGrid
              updateselectedSession={this.updateselectedSessionId}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TradeSession;
