import React, { Component } from "react";
import { Card, Popup, Button, Icon } from "semantic-ui-react";
import "./TradeSessionCard.scss";

class TradeSessionCard extends Component {
  renderTradeSessionDetails = () => {
    // Add your logic here to render the trade session details
    console.log("Details for session: ", this.props.session.id);
  };
  calculateDuration = (started_at, closed_at) => {
    const startDate = new Date(started_at);
    const endDate = closed_at ? new Date(closed_at) : new Date();
    const duration = endDate - startDate;
    return this.formatDuration(Math.floor(duration / 1000 / 60)); // returns duration in minutes
  };

  formatDuration = (durationInMinutes) => {
    const days = Math.floor(durationInMinutes / (60 * 24));
    const hours = Math.floor((durationInMinutes % (60 * 24)) / 60);
    const minutes = durationInMinutes % 60;
    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${minutes}m`;
  };

  formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  render() {
    const { session, isNewSession } = this.props;
    const duration = this.calculateDuration(
      session.started_at,
      session.closed_at
    );
    const popupContent = `Started at: ${this.formatTime(
      session.started_at
    )}\nClosed at: ${
      session.closed_at ? this.formatTime(session.closed_at) : "Still active"
    }`;
    const profitColor =
      session.net_profit > 0
        ? "green"
        : session.net_profit < 0
        ? "red"
        : "grey";
    const cardClass = `session-card ${isNewSession ? "new-session" : ""}`;
    return (
      <div className={cardClass}>
        <Card>
          <Button animated="vertical" onClick={this.renderTradeSessionDetails}>
            <Button.Content hidden>See All Trdes</Button.Content>
            <Button.Content visible>
                <span>Details</span> 
              <Icon name="shop" />
            </Button.Content>
          </Button>
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
