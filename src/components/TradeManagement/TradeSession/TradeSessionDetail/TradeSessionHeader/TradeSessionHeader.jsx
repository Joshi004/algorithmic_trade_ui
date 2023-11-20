import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import "./TradeSessionHeader.scss";

class TradeSessionHeader extends Component {
  render() {
    const { sessionInfo, dataPoints } = this.props;
    return (
      <Card fluid>
        <Card.Content className="trade-session-header">
          <span className="header-span">
            <Card.Header>
              ID: {sessionInfo.id} | Profit: {sessionInfo.net_profit} | Active:{" "}
              {sessionInfo.is_active ? "Yes " : "No "}|{" "}
              {dataPoints?.instrument
                ? dataPoints["instrument"]["instrument_name"]
                : null}
            </Card.Header>
          </span>

          <span className="description-span">
            <Card.Description>
              Frequency: {sessionInfo.trading_frequency} | Scanning:{" "}
              {sessionInfo.scanning_algorithm_name} | Tracking:{" "}
              {sessionInfo.tracking_algorithm_name}
            </Card.Description>
          </span>
          <span className="meta-span">
            <Card.Meta>
            | {dataPoints?.trade_id
                ? dataPoints["trade_id"]
                : null} |
              Started: {new Date(sessionInfo.started_at).toLocaleDateString()}
            </Card.Meta>
          </span>
        </Card.Content>
      </Card>
    );
  }
}

export default TradeSessionHeader;
