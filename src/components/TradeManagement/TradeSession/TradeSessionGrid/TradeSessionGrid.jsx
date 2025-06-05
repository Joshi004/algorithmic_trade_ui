import React, { Component } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Box, 
  Typography,
  Grid,
  Fab
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TradeSessionCard from "./TradeSessionCard/TradeSessionCard";
import TradeSessionForm from "./TradeSessionForm/TradeSessionForm";
import "./TradeSessionGrid.scss";
import apiService from "../../../../services/apiService";
import ENDPOINTS from "../../../../services/endpoints";

// Styled components
const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

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
    this.state = { modalOpen: false, sessions: {}, newSessionId: null };
  }

  componentDidMount() {
    this.fetchTradeSessionsInfo();
  }

  handleFormSubmit = async (formData) => {
    try {
      await this.initiateTradeSession(formData);
      this.setState({ modalOpen: false });
    } catch (error) {
      // Error is handled in the form component
      console.error("Failed to initiate trade session:", error);
    }
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  updateSession = (sessionId, key, value) => {
    let sessionCopy = JSON.parse(JSON.stringify(this.state.sessions));
    sessionCopy[sessionId][key] = value;
    this.setState({ sessions: sessionCopy });
  };

  populateTradeSession = async (tradeSessionID) => {
    let existing = false;
    Object.values(this.state.sessions).forEach((session) => {
      if (session.id === tradeSessionID) {
        existing = true;
        return;
      }
    });

    if (existing) {
      this.setState({ newSessionId: tradeSessionID }, () => {
        setTimeout(() => this.setState({ newSessionId: null }), 2000);
      });
    } else {
      try {
        const data = await apiService.get(`${ENDPOINTS.TRADE_SESSIONS.GET_ALL}?session_id=${tradeSessionID}`);
        this.setState({
          sessions: { ...this.state.sessions, ...data.data.trade_sessions },
        });
      } catch (error) {
        console.error("Error fetching trade session:", error);
      }
    }
  };

  initiateTradeSession = async (formData) => {
    const { scanningAlgorithmId, initiationAlgorithmId, terminationAlgorithmId, tradingFrequency, isDummy } = formData;
    const dummyValue = isDummy ? 1 : 0;
    
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.INITIATE}?trading_frequency=${tradingFrequency}&dummy=${dummyValue}&scanning_algorithm_id=${scanningAlgorithmId}&initiation_algorithm_id=${initiationAlgorithmId}&termination_algorithm_id=${terminationAlgorithmId}`;
      const data = await apiService.get(url);
      this.populateTradeSession(data.trade_session_id);
      this.initiateCommunicationChannal(data.trade_session_id);
    } catch (error) {
      console.error("Error initiating trade session:", error);
      throw error; // Re-throw to allow form to handle the error
    }
  };

  fetchTradeSessionsInfo = async () => {
    try {
      const data = await apiService.get(`${ENDPOINTS.TRADE_SESSIONS.GET_ALL}?dummy=1`);
      const sessions = data.data.trade_sessions;
      const updatedSessions = sessions.reduce((acc, session) => {
        acc[session.id] = session;
        return acc;
      }, {});
      this.setState({ sessions: updatedSessions });
    } catch (error) {
      console.error("Error fetching trade sessions:", error);
    }
  };

  render() {
    const { modalOpen, sessions, newSessionId } = this.state;

    // Define the order of the status
    const statusOrder = { active: 1, paused: 2, terminated: 3 };

    // Sort the sessions
    const sortedSessions = Object.values(sessions).sort((a, b) => {
      // Sort by status first
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // If status is the same, sort by started_at in descending order
      return new Date(b.started_at) - new Date(a.started_at);
    });

    return (
      <Box className="trade-session-grid-component" p={3}>
        <HeaderBox>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
              Trade Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your algorithmic trading sessions
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

        <Grid container spacing={3} className="trade-session-grid">
          {sortedSessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <TradeSessionCard
                className="session-card"
                terminateTradeSession={this.props.terminateTradeSession}
                session={session}
                isNewSession={session.id === newSessionId}
                handleTradeSessionDetails={this.props.updateselectedSession}
                resumeTradeSession={this.props.resumeTradeSession}
                updateSession={this.updateSession}
              />
            </Grid>
          ))}
        </Grid>

        {/* Floating Action Button for mobile */}
        <StyledFab
          color="primary"
          aria-label="add"
          onClick={this.handleOpen}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <AddIcon />
        </StyledFab>

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
