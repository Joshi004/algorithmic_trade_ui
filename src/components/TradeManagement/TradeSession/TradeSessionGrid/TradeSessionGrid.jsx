import "./TradeSessionGrid.scss";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import React, { Component } from "react";

import ENDPOINTS from "../../../../services/endpoints";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TradeSessionForm from "./TradeSessionForm/TradeSessionForm";
import TradeSessionsList from "./TradeSessionsList/TradeSessionsList";
import apiService from "../../../../services/apiService";
import { styled } from "@mui/material/styles";

// Styled components
const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
}));

class TradeSessionGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      modalOpen: false,
      refreshTrigger: 0 // Used to trigger refresh of trade sessions list
    };
  }

  handleFormSubmit = async (formData) => {
    try {
      await this.initiateTradeSession(formData);
      this.setState({ 
        modalOpen: false,
        refreshTrigger: this.state.refreshTrigger + 1 // Trigger refresh of trade sessions list
      });
    } catch (error) {
      console.error("Failed to initiate trade session:", error);
    }
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  initiateTradeSession = async (formData) => {
    const { scanningAlgorithmId, initiationAlgorithmId, terminationAlgorithmId, tradingFrequency, isDummy } = formData;
    const dummyValue = isDummy ? 1 : 0;
    
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.INITIATE}?trading_frequency=${tradingFrequency}&dummy=${dummyValue}&scanning_algorithm_id=${scanningAlgorithmId}&initiation_algorithm_id=${initiationAlgorithmId}&termination_algorithm_id=${terminationAlgorithmId}`;
      const data = await apiService.get(url);
      
      // Show success message or handle success
      console.log("Trade session created successfully:", data.trade_session_id);
    } catch (error) {
      console.error("Error initiating trade session:", error);
      throw error;
    }
  };

  render() {
    const { modalOpen, refreshTrigger } = this.state;

    return (
      <Box className="trade-session-grid-component" p={3}>
        <HeaderBox>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
              Trade Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage your algorithmic trading sessions
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={this.handleOpen}
            sx={{ 
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            New Session
          </Button>
        </HeaderBox>

        {/* Trade Sessions List */}
        <TradeSessionsList 
          sessionParameters={this.props.sessionParameters}
          refreshTrigger={refreshTrigger}
        />

        {/* New Session Dialog */}
        <Dialog 
          open={modalOpen} 
          onClose={this.handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" component="h2" fontWeight="600">
              Create New Trade Session
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <TradeSessionForm 
              onSubmit={this.handleFormSubmit} 
              sessionParameters={this.props.sessionParameters}
              parametersLoading={this.props.parametersLoading}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

export default TradeSessionGrid;
