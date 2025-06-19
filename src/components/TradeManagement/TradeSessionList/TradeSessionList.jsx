import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Skeleton,
  Typography
} from '@mui/material';
import React, { Component } from 'react';

import ENDPOINTS from '../../../services/endpoints';
import TradeSession from './TradeSession/TradeSession';
import TradeSessionService from '../../../services/tradeSessionService';
import apiService from '../../../services/apiService';
import { styled } from '@mui/material/styles';
import toastService from '../../../services/toastService';

const ListContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%',
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(2),
  border: `1px dashed ${theme.palette.grey[300]}`,
}));

class TradeSessionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeSessions: [],
      loading: true,
      error: null,
      refreshing: false,
      confirmDialog: {
        open: false,
        action: null,
        sessionId: null,
        sessionName: null
      },
      actionLoading: false
    };
  }

  componentDidMount() {
    this.fetchTradeSessions();
  }

  componentDidUpdate(prevProps) {
    // Refresh the list when sessionParameters become available
    if (!prevProps.sessionParameters && this.props.sessionParameters) {
      this.fetchTradeSessions();
    }
    
    // Refresh when a new session is created
    if (prevProps.refreshTrigger !== this.props.refreshTrigger) {
      this.fetchTradeSessions();
    }
  }

  fetchTradeSessions = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      // Use TradeSessionService for API calls
      const response = await TradeSessionService.getUserTradeSessions();
      
      // Extract sessions data from response
      const sessionsData = response?.data || [];
      
      this.setState({
        tradeSessions: sessionsData,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching trade sessions:', error);
      
      this.setState({
        tradeSessions: [],
        loading: false,
        error: 'Failed to load trade sessions. Please try again.',
      });
    }
  };

  handleSessionAction = async (action, sessionId) => {
    const session = this.state.tradeSessions.find(s => s.id === sessionId);
    const sessionName = session ? `Session #${sessionId}` : `Session #${sessionId}`;

    // Show confirmation dialog for pause action
    if (action === 'pause') {
      this.setState({
        confirmDialog: {
          open: true,
          action: action,
          sessionId: sessionId,
          sessionName: sessionName
        }
      });
      return;
    }

    // For other actions, execute directly
    this.executeSessionAction(action, sessionId, sessionName);
  };

  executeSessionAction = async (action, sessionId, sessionName) => {
    try {
      this.setState({ actionLoading: true, refreshing: true });
      
      let response;
      switch (action) {
        case 'pause':
          response = await TradeSessionService.pauseTradeSession(sessionId);
          toastService.success(`${sessionName} paused successfully. No further scanning will occur until resumed.`);
          break;
        case 'resume':
          response = await TradeSessionService.resumeTradeSession(sessionId);
          toastService.success(`${sessionName} resumed successfully. Scanning will now continue.`);
          break;
        case 'stop':
          // TODO: Implement stop functionality when API is available
          console.log(`Stop action not yet implemented for session ${sessionId}`);
          toastService.info('Stop functionality is not yet implemented.');
          this.setState({ actionLoading: false, refreshing: false });
          return;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      console.log(`${action} action completed for session ${sessionId}:`, response);
      
      // Refresh the sessions list after successful action
      await this.fetchTradeSessions();
      
    } catch (error) {
      console.error(`Error performing ${action} on session ${sessionId}:`, error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.error || error.message || `Failed to ${action} session`;
      toastService.error(`Error: ${errorMessage}`);
      
      // Update local state as fallback if API fails
      this.updateSessionStatusLocally(sessionId, action);
      
    } finally {
      this.setState({ 
        actionLoading: false,
        refreshing: false,
        confirmDialog: {
          open: false,
          action: null,
          sessionId: null,
          sessionName: null
        }
      });
    }
  };

  handleConfirmAction = () => {
    const { action, sessionId, sessionName } = this.state.confirmDialog;
    this.executeSessionAction(action, sessionId, sessionName);
  };

  handleCancelAction = () => {
    this.setState({
      confirmDialog: {
        open: false,
        action: null,
        sessionId: null,
        sessionName: null
      }
    });
  };

  updateSessionStatusLocally = (sessionId, action) => {
    this.setState(prevState => ({
      tradeSessions: prevState.tradeSessions.map(session => {
        if (session.id === sessionId) {
          let newStatus = session.status;
          let newIsActive = session.is_active;
          let newClosedAt = session.closed_at;
          
          switch (action) {
            case 'pause':
              newStatus = 'paused';
              newIsActive = false;
              break;
            case 'resume':
              newStatus = 'started';
              newIsActive = true;
              break;
            case 'stop':
              newStatus = 'stopped';
              newIsActive = false;
              newClosedAt = new Date().toISOString();
              break;
            default:
              break;
          }
          
          return {
            ...session,
            status: newStatus,
            is_active: newIsActive,
            closed_at: newClosedAt,
          };
        }
        return session;
      }),
    }));
  };

  handleSessionUpdate = (sessionId, updatedSessionData) => {
    // Update the trade session in the local state with the detailed data
    this.setState(prevState => ({
      tradeSessions: prevState.tradeSessions.map(session => 
        session.id === sessionId 
          ? { ...session, ...updatedSessionData }
          : session
      )
    }));
  };

  renderConfirmationDialog = () => {
    const { confirmDialog } = this.state;
    const { open, action, sessionName } = confirmDialog;

    if (action !== 'pause') return null;

    return (
      <Dialog
        open={open}
        onClose={this.handleCancelAction}
        aria-labelledby="confirm-pause-dialog-title"
        aria-describedby="confirm-pause-dialog-description"
      >
        <DialogTitle id="confirm-pause-dialog-title">
          Pause Trade Session
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-pause-dialog-description">
            Are you sure you want to pause {sessionName}?
            <br /><br />
            <strong>What happens when you pause:</strong>
            <br />
            • No new instruments will be scanned for this session
            • No new trades will be initiated
            • Active trades will not be terminated
            • The session can be resumed later
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancelAction}>
            Cancel
          </Button>
          <Button 
            onClick={this.handleConfirmAction} 
            variant="contained" 
            color="warning"
            disabled={this.state.actionLoading}
          >
            {this.state.actionLoading ? 'Pausing...' : 'Pause Session'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderSkeletonLoading = () => {
    return (
      <Box>
        {[1, 2, 3].map((index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="20%" height={32} />
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Skeleton variant="text" width="25%" height={20} />
              <Skeleton variant="text" width="25%" height={20} />
              <Skeleton variant="text" width="25%" height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  renderEmptyState = () => {
    return (
      <EmptyStateContainer>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Trade Sessions Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You haven't created any trading sessions yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "New Session" to create your first trading session.
        </Typography>
      </EmptyStateContainer>
    );
  };

  render() {
    const { tradeSessions, loading, error, refreshing } = this.state;
    const { sessionParameters } = this.props;

    return (
      <ListContainer>
        {/* Error Message */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          this.renderSkeletonLoading()
        ) : (
          <>
            {/* Empty State */}
            {tradeSessions.length === 0 ? (
              this.renderEmptyState()
            ) : (
              <>
                {/* Sessions List */}
                <Fade in={!loading}>
                  <Box>
                    {tradeSessions.map((session) => (
                      <TradeSession
                        key={session.id}
                        session={session}
                        sessionParameters={sessionParameters}
                        onAction={this.handleSessionAction}
                        onSessionUpdate={this.handleSessionUpdate}
                        disabled={refreshing}
                      />
                    ))}
                  </Box>
                </Fade>

                {/* Loading Overlay */}
                {refreshing && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      mt: 2,
                      opacity: 0.7 
                    }}
                  >
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      Updating sessions...
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {this.renderConfirmationDialog()}
      </ListContainer>
    );
  }
}

export default TradeSessionList; 