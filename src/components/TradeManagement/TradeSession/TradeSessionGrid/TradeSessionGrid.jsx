import React, { Component } from "react";
import { Grid, Modal, Button, Icon } from "semantic-ui-react";
import TradeSessionCard from "./TradeSessionCard/TradeSessionCard";
import TradeSessionForm from "./TradeSessionForm/TradeSessionForm";
import "./TradeSessionGrid.scss";
class TradeSessionGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }
  handleFormSubmit = (formData) => {
    this.setState({ modalOpen: false });
    this.props.handleFormSubmit(formData);
  };
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
    const { sessions, newSessionId } = this.props;
    const { modalOpen } = this.state;

    // Define the order of the status
    const statusOrder = { active: 1, paused: 2, terminated: 3 };

    // Sort the sessions
    const sortedSessions = [...sessions].sort((a, b) => {
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
              className = "session-card"
              terminateTradeSession={this.props.terminateTradeSession}
              key={session.id}
              session={session}
              isNewSession={session.id === newSessionId}
              handleTradeSessionDetails={this.props.handleTradeSessionDetails}
              resumeTradeSession={this.props.resumeTradeSession}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TradeSessionGrid;
