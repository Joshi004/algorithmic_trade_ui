import {
  Alert,
  Box,
  CircularProgress,
  Fade,
  Skeleton,
  Typography
} from '@mui/material';
import React, { Component } from 'react';

import ENDPOINTS from '../../../services/endpoints';
import TradeSession from './TradeSession/TradeSession';
import apiService from '../../../services/apiService';
import { styled } from '@mui/material/styles';

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
      
      // Use real API endpoint for user trade sessions
      const response = await apiService.get(ENDPOINTS.TRADE_SESSIONS.GET_ALL);
      
      // Extract sessions data from response
      const sessionsData = response?.data || [];
      
      this.setState({
        tradeSessions: sessionsData,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching trade sessions:', error);
      
      // Show error message instead of using mock data
      this.setState({
        tradeSessions: [],
        loading: false,
        error: 'Failed to load trade sessions. Please try again.',
      });
    }
  };

  handleSessionAction = async (action, sessionId) => {
    try {
      this.setState({ refreshing: true });
      
      let endpoint;
      switch (action) {
        case 'pause':
          endpoint = `${ENDPOINTS.TRADE_SESSIONS.PAUSE}/${sessionId}`;
          break;
        case 'resume':
          endpoint = `${ENDPOINTS.TRADE_SESSIONS.RESUME}/${sessionId}`;
          break;
        case 'stop':
          endpoint = `${ENDPOINTS.TRADE_SESSIONS.TERMINATE}/${sessionId}`;
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Call the real API endpoint
      console.log(`Calling ${action} API for session ${sessionId}`);
      await apiService.post(endpoint);
      
      // Refresh the sessions list after successful action
      await this.fetchTradeSessions();
      
    } catch (error) {
      console.error(`Error performing ${action} on session ${sessionId}:`, error);
      
      // For now, update local state as fallback if API fails
      this.updateSessionStatusLocally(sessionId, action);
      
      this.setState({ 
        error: `Warning: ${action} action may not be fully processed. Please refresh to verify.`,
      });
    } finally {
      this.setState({ refreshing: false });
    }
  };

  updateSessionStatusLocally = (sessionId, action) => {
    this.setState(prevState => ({
      tradeSessions: prevState.tradeSessions.map(session => {
        if (session.id === sessionId) {
          let newStatus = session.status;
          let newClosedAt = session.closed_at;
          
          switch (action) {
            case 'pause':
              newStatus = 'paused';
              break;
            case 'resume':
              newStatus = 'started';
              break;
            case 'stop':
              newStatus = 'stopped';
              newClosedAt = new Date().toISOString();
              break;
            default:
              break;
          }
          
          return {
            ...session,
            status: newStatus,
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
      </ListContainer>
    );
  }
}

export default TradeSessionList; 