import "./TradeSession.scss";

import { Button, Icon, Modal } from "semantic-ui-react";
import React, { Component } from "react";

import ENDPOINTS from "../../../services/endpoints";
import TradeSessionDetail from "./TradeSessionDetail/TradeSessionDetail";
import TradeSessionForm from "./TradeSessionGrid/TradeSessionForm/TradeSessionForm";
import TradeSessionGrid from "./TradeSessionGrid/TradeSessionGrid";
import { w3cwebsocket as WebSocketClient } from "websocket";
import apiService from "../../../services/apiService";
import config from "../../../config";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      selectedSessionId: null,
      sessionParameters: null,
      parametersLoading: true,
    };
  }

  async componentDidMount() {
    await this.fetchSessionParameters();
  }

  fetchSessionParameters = async () => {
    try {
      this.setState({ parametersLoading: true });
      const data = await apiService.get(ENDPOINTS.TRADE_SESSIONS.GET_PARAMS);
      this.setState({ 
        sessionParameters: data.data,
        parametersLoading: false 
      });
    } catch (error) {
      console.error("Error fetching session parameters:", error);
      this.setState({ 
        sessionParameters: null,
        parametersLoading: false 
      });
    }
  };

  initiateCommunicationChannal = (tradeSessionID) => {
    console.log("Initiate Communication Channal");
    // Use baseUrl from config and replace http/https with ws/wss
    const wsBaseUrl = config.apiBaseUrl.replace(/^http/, 'ws');
    this.ws = new WebSocketClient(
      `${wsBaseUrl}/ws/setup_trade_session_commnication/?trade_session_id=${tradeSessionID}`
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
    const { selectedSessionId, sessionParameters, parametersLoading } = this.state;
    return (
      <div className="trade-session">
        {selectedSessionId ? (
          <TradeSessionDetail 
            tradeSessionID={selectedSessionId} 
            sessionParameters={sessionParameters}
            parametersLoading={parametersLoading}
          />
        ) : (
          <div className="trade-session">
            <TradeSessionGrid
              updateselectedSession={this.updateselectedSessionId}
              sessionParameters={sessionParameters}
              parametersLoading={parametersLoading}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TradeSession;
