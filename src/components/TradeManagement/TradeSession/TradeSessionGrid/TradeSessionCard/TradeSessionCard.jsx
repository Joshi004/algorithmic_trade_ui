import React, { Component } from "react";
import { Card, Popup, Button, Icon } from "semantic-ui-react";
import * as Helper from "./TradeSessionCardHelper";

class TradeSessionCard extends Component {
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
    return (
      <div className={cardClass}>
        <Card>
          <Button animated="vertical" onClick={()=>{this.props.handleTradeSessionDetails(session.id)}}>
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
