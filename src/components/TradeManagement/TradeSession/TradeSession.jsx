import "./TradeSession.scss";

import React, { Component } from "react";

import ENDPOINTS from "../../../services/endpoints";
import TradeSessionGrid from "./TradeSessionGrid/TradeSessionGrid";
import apiService from "../../../services/apiService";
import cacheService from "../../../services/cacheService";

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
      
      // Check cache first
      const cachedParams = cacheService.getTradeSessionParams();
      if (cachedParams) {
        console.log("Using cached session parameters");
        this.setState({ 
          sessionParameters: cachedParams,
          parametersLoading: false 
        });
        return;
      }
      
      // Fetch from API if not cached
      console.log("Fetching session parameters from API");
      const data = await apiService.get(ENDPOINTS.TRADE_SESSIONS.GET_PARAMS);
      
      // Cache the response
      if (data && data.data) {
        cacheService.setTradeSessionParams(data.data);
        console.log("Session parameters cached successfully");
      }
      
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
