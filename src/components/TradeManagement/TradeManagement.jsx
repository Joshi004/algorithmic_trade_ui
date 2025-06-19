import { Box } from '@mui/material';
import CreateTradeSession from './CreateTradeSession/CreateTradeSession';
import React from 'react';
import TradeManagementHeader from './TradeManagementHeader/TradeManagementHeader';
import TradeSessionList from './TradeSessionList/TradeSessionList';
import TradeSessionService from '../../services/tradeSessionService';
import cacheService from '../../services/cacheService';

class TradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionParameters: null,
      parametersLoading: true,
      refreshTrigger: 0 // Used to trigger refresh of trade sessions list
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
      
      // Fetch from API if not cached - use TradeSessionService
      console.log("Fetching session parameters from API");
      const data = await TradeSessionService.getSessionParameterOptions();
      
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

  handleSessionCreated = () => {
    // Trigger refresh of trade sessions list when a new session is created
    this.setState({ 
      refreshTrigger: this.state.refreshTrigger + 1
    });
  };

  render() {
    const { sessionParameters, parametersLoading, refreshTrigger } = this.state;

    return (
      <Box p={3}>
        <TradeManagementHeader />
        
        <CreateTradeSession 
          sessionParameters={sessionParameters}
          parametersLoading={parametersLoading}
          onSessionCreated={this.handleSessionCreated}
        />
        
        <TradeSessionList 
          sessionParameters={sessionParameters}
          refreshTrigger={refreshTrigger}
        />
      </Box>
    );
  }
}

export default TradeManagement;
