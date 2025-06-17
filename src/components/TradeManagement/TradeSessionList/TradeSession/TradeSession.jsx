import React, { Component } from 'react';
import { Accordion } from '@mui/material';
import { styled } from '@mui/material/styles';
import TradeSessionSummary from './TradeSessionSummary/TradeSessionSummary';
import TradeSessionDetails from './TradeSessionDetails/TradeSessionDetails';
import ENDPOINTS from '../../../../services/endpoints';
import apiService from '../../../../services/apiService';

// Styled components
const StyledAccordion = styled(Accordion)(({ theme, isdummy }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${isdummy === 'true' ? theme.palette.warning.main : theme.palette.divider}`,
  backgroundColor: isdummy === 'true' ? theme.palette.warning.light + '08' : theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(1.5)}px 0`,
    boxShadow: theme.shadows[3],
  },
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: isdummy === 'true' ? theme.palette.warning.main : theme.palette.primary.light,
  },
  transition: theme.transitions.create(['box-shadow', 'border-color'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionDetails: null,
      loadingDetails: false,
      detailsError: null,
      expanded: false,
    };
  }

  fetchSessionDetails = async (sessionId) => {
    if (this.state.loadingDetails) return;

    this.setState({ loadingDetails: true, detailsError: null });

    try {
      const response = await apiService.get(
        `${ENDPOINTS.TRADE_SESSIONS.GET_DETAILS}?trade_session_id=${sessionId}`
      );

      // Extract session details from response (consistent with other API calls)
      const sessionData = response?.data || response;
      
      this.setState({ 
        sessionDetails: sessionData,
        loadingDetails: false 
      });
      
      // If onSessionUpdate is provided, update the parent component's session data
      if (this.props.onSessionUpdate) {
        this.props.onSessionUpdate(sessionId, sessionData);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      this.setState({ 
        detailsError: error.message || 'Failed to load session details',
        loadingDetails: false 
      });
    }
  };

  handleAccordionChange = (event, isExpanded) => {
    this.setState({ expanded: isExpanded });
    
    if (isExpanded && !this.state.sessionDetails) {
      this.fetchSessionDetails(this.props.session.id);
    }
  };

  handleRefreshDetails = () => {
    this.fetchSessionDetails(this.props.session.id);
  };

  handleAction = (action, sessionId) => {
    if (this.props.onAction) {
      this.props.onAction(action, sessionId);
    }
  };

  formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return '0%';
    return `${percentage.toFixed(1)}%`;
  };

  getAlgorithmName = (algorithmId, algorithmType) => {
    if (!this.props.sessionParameters) return `ID: ${algorithmId}`;
    
    const algorithms = this.props.sessionParameters[`${algorithmType}_algorithms`];
    if (!algorithms) return `ID: ${algorithmId}`;

    const algorithm = algorithms.find(alg => alg.id === algorithmId);
    if (!algorithm) return `ID: ${algorithmId}`;

    // Return a shortened version of the name for display
    const maxLength = 15;
    return algorithm.name.length > maxLength 
      ? `${algorithm.name.substring(0, maxLength)}...`
      : algorithm.name;
  };

  render() {
    const { session, disabled } = this.props;
    const { sessionDetails, loadingDetails, detailsError, expanded } = this.state;
    const isDummy = session.dummy === 1 || session.dummy === true;

    return (
      <StyledAccordion 
        isdummy={isDummy.toString()}
        expanded={expanded}
        onChange={this.handleAccordionChange}
        disabled={disabled}
      >
        <TradeSessionSummary 
          session={session}
          isDummy={isDummy}
          getAlgorithmName={this.getAlgorithmName}
          formatDateTime={this.formatDateTime}
        />
        
        <TradeSessionDetails
          session={session}
          sessionDetails={sessionDetails}
          loadingDetails={loadingDetails}
          detailsError={detailsError}
          onRefreshDetails={this.handleRefreshDetails}
          onAction={this.handleAction}
          formatDateTime={this.formatDateTime}
          formatCurrency={this.formatCurrency}
          formatPercentage={this.formatPercentage}
        />
      </StyledAccordion>
    );
  }
}

export default TradeSession; 