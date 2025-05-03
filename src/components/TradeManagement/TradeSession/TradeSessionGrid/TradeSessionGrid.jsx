import React, { Component } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import TradeSessionCard from "./TradeSessionCard/TradeSessionCard";
import TradeSessionForm from "./TradeSessionForm/TradeSessionForm";
import "./TradeSessionGrid.scss";
import apiService from "../../../../services/apiService";
import ENDPOINTS from "../../../../services/endpoints";

class TradeSessionGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, sessions: {}, newSessionId: null };
  }

  componentDidMount() {
    this.fetchTradeSessionsInfo();
  }

  handleFormSubmit = (formData) => {
    this.setState({ modalOpen: false });
    this.initiateTradeSession(formData);
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
    const { scanningAlgorithm, trackingAlgorithm, tradingFrequency, isDummy } = formData;
    const dummyValue = isDummy ? 1 : 0;
    
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.INITIATE}?trading_frequency=${tradingFrequency}&user_id=1&dummy=${dummyValue}&scanning_algorithm_name=${scanningAlgorithm}&tracking_algorithm_name=${trackingAlgorithm}`;
      const data = await apiService.get(url);
      this.populateTradeSession(data.trade_session_id);
      this.initiateCommunicationChannal(data.trade_session_id);
    } catch (error) {
      console.error("Error initiating trade session:", error);
    }
  };

  fetchTradeSessionsInfo = async () => {
    try {
      const data = await apiService.get(`${ENDPOINTS.TRADE_SESSIONS.GET_ALL}?user_id=1&dummy=1`);
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
      <div className="trade-session-grid-component">
        <div className="trade-session-grid-header">
          <Modal
            trigger={
              <Button primary className="init-button" onClick={this.handleOpen}>
                Create New Session <Icon name="plus" className="plus-icon" />
              </Button>
            }
            open={modalOpen}
            onClose={this.handleClose}
          >
            <Modal.Header>Create Trade Session</Modal.Header>
            <Modal.Content>
              <TradeSessionForm onSubmit={this.handleFormSubmit} />
            </Modal.Content>
          </Modal>
        </div>
        <div className="trade-session-grid">
          {sortedSessions.map((session) => (
            <TradeSessionCard
              className="session-card"
              terminateTradeSession={this.props.terminateTradeSession}
              key={session.id}
              session={session}
              isNewSession={session.id === newSessionId}
              handleTradeSessionDetails={this.props.updateselectedSession}
              resumeTradeSession={this.props.resumeTradeSession}
              updateSession={this.updateSession}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TradeSessionGrid;
