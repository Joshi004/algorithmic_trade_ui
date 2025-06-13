import "./TradeSession.scss";

import React, { Component } from "react";

import ENDPOINTS from "../../../services/endpoints";
import TradeSessionGrid from "./TradeSessionGrid/TradeSessionGrid";
import apiService from "../../../services/apiService";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const { sessionParameters, parametersLoading } = this.state;
    return (
      <div className="trade-session">
        <TradeSessionGrid
          sessionParameters={sessionParameters}
          parametersLoading={parametersLoading}
        />
      </div>
    );
  }
}

export default TradeSession;
