import React, { Component } from "react";
import { Card, Popup, Button, Icon, Label, Confirm } from "semantic-ui-react";
import * as Helper from "./TradeSessionCardHelper";

class TradeSessionCard extends Component {
  state = { open: false };

  show = () => this.setState({ open: true });
  handleConfirm = () => {
    this.setState({ open: false });
    this.props.terminateTradeSession(this.props.session.id);
  };
  handleCancel = () => this.setState({ open: false });
  render() {
    const { session, isNewSession } = this.props;
    const duration = Helper.calculateDuration(
      session.started_at,
      session.closed_at
    );
    const popupContent = `Started at: ${Helper.formatTime(
      session.started_at
    )}\nClosed at: ${
      session.closed_at ? Helper.formatTime(session.closed_at) : "Still active"
    }`;
    const profitColor =
      session.net_profit > 0
        ? "green"
        : session.net_profit < 0
        ? "red"
        : "grey";
    const cardClass = `session-card ${isNewSession ? "new-session" : ""}`;
    const statusColor =
      session.status === "active"
        ? "green"
        : session.status === "paused"
        ? "yellow"
        : "grey";
    return (
      <div className={cardClass}>
        <Card>
          <Card
            animated="vertical"
            color={statusColor}
            className="status-label"
          >
            <Card.Content>
              <Icon
                disabled={
                  session.status === "terminated" || session.status === "active"
                }
                name="play circle"
                className="play-icon"
                size="large"
                style={{ float: "left", cursor: "pointer" }}
                color={statusColor}
                onClick={() => this.props.resumeTradeSession(session.id)}
              />
              <span
                style={{ cursor: "pointer" }}
                className="details"
                onClick={() => {
                  this.props.handleTradeSessionDetails(session.id);
                }}
              >
                Details
                <Icon name="shop" />
              </span>
              <Icon
                className="cross-icon"
                name="close"
                onClick={this.show}
                style={{ float: "right", cursor: "pointer" }}
              />
              <Confirm
                open={this.state.open}
                onCancel={this.handleCancel}
                onConfirm={this.handleConfirm}
                content="This will terminate all the trades and this is not a reversible action. Are you sure?"
              />
            </Card.Content>
          </Card>
          <Card.Content>
            <Card.Header>{`Session ID: ${session.id}`}</Card.Header>
            <Popup
              content={popupContent}
              trigger={<Card.Meta>{`Duration: ${duration}`}</Card.Meta>}
            />
            <Card.Description>
              <span
                style={{ color: profitColor }}
              >{`Net Profit: ${session.net_profit}`}</span>
              <br />
              {`Trading Frequency: ${session.trading_frequency}`}
              <br />
              {`Scanning Algorithm: ${session.scanning_algorithm_name}`}
              <br />
              {`Tracking Algorithm: ${session.tracking_algorithm_name}`}
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default TradeSessionCard;
