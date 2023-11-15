import React, { Component } from "react";
import TradeSessionHeader from './TradeSessionHeader/TradeSessionHeader';
import './TradeSessionDetail.scss';

class TradeSessionDetail extends Component {
  render() {
    const { sessionInfo } = this.props;
    return (
      <div className="trade-session-details">
        <TradeSessionHeader sessionInfo={sessionInfo} />
        {/* Other sections will go here */}
      </div>
    );
  }
}

export default TradeSessionDetail;
