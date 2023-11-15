import React, { Component } from "react";
import { Grid,Modal,Button,Icon } from "semantic-ui-react";
import TradeSessionCard from "./TradeSessionCard/TradeSessionCard";
import TradeSessionForm from "./TradeSessionForm/TradeSessionForm";
import "./TradeSessionGrid.scss";
class TradeSessionGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen:false};
  }
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
    const { sessions, newSessionId } = this.props;
    const { modalOpen } = this.state;
    return (
      <div className="trade-session-grid">
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
            <TradeSessionForm onSubmit={this.props.handleFormSubmit} />
          </Modal.Content>
        </Modal>
        {sessions.map((session) => (
          <TradeSessionCard
            key={session.id}
            session={session}
            isNewSession={session.id === newSessionId}
            handleTradeSessionDetails={this.props.handleTradeSessionDetails}
          />
        ))}
      </div>
    );
  }
}

export default TradeSessionGrid;
