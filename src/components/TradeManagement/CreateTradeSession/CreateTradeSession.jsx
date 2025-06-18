import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import React, { Component } from 'react';

import ENDPOINTS from '../../../services/endpoints';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TradeSessionForm from './TradeSessionForm';
import apiService from '../../../services/apiService';

class CreateTradeSession extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      modalOpen: false
    };
  }

  handleFormSubmit = async (formData) => {
    try {
      await this.initiateTradeSession(formData);
      this.setState({ modalOpen: false });
      
      // Notify parent component about successful creation
      if (this.props.onSessionCreated) {
        this.props.onSessionCreated();
      }
    } catch (error) {
      console.error("Failed to initiate trade session:", error);
    }
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  initiateTradeSession = async (formData) => {
    const { scanningAlgorithmName, initiationAlgorithmName, terminationAlgorithmName, tradingFrequency, isDummy } = formData;
    const dummyValue = isDummy ? 1 : 0;
    
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.INITIATE}?trading_frequency=${tradingFrequency}&dummy=${dummyValue}&scanning_algorithm_name=${scanningAlgorithmName}&initiation_algorithm_name=${initiationAlgorithmName}&termination_algorithm_name=${terminationAlgorithmName}`;
      const data = await apiService.get(url);
      
      // Show success message or handle success
      console.log("Trade session created successfully:", data.trade_session_id);
    } catch (error) {
      console.error("Error initiating trade session:", error);
      throw error;
    }
  };

  render() {
    const { modalOpen } = this.state;
    const { sessionParameters, parametersLoading } = this.props;

    return (
      <Box>
        {/* New Session Button */}
        <Box display="flex" justifyContent="flex-end" mb={3}>
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
        </Box>

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
              sessionParameters={sessionParameters}
              parametersLoading={parametersLoading}
            />
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

export default CreateTradeSession; 