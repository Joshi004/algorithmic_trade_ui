import React, { Component } from "react";
import { Card } from 'semantic-ui-react';
import './TradeSessionHeader.scss';

class TradeSessionHeader extends Component {
  render() {
    const { sessionInfo } = this.props;
    return (
      <Card fluid className="trade-session-header">
        <Card.Content>
          <Card.Header>
            Session ID: {sessionInfo.id} | Net Profit: {sessionInfo.net_profit}
          </Card.Header>
          <Card.Meta>
            Started At: {new Date(sessionInfo.started_at).toLocaleString()} | Is Active: {sessionInfo.is_active ? 'Yes' : 'No'}
          </Card.Meta>
          <Card.Description>
            Trading Frequency: {sessionInfo.trading_frequency} | Scanning Algorithm: {sessionInfo.scanning_algorithm_name} | Tracking Algorithm: {sessionInfo.tracking_algorithm_name}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default TradeSessionHeader;
