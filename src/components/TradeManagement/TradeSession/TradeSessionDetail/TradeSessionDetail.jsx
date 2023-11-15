import React, { Component } from "react";
import TradeSessionHeader from './TradeSessionHeader/TradeSessionHeader';
import TradeBar from './TradeBar/TradeBar'; // Import the TradeBar component
import './TradeSessionDetail.scss';

class TradeSessionDetail extends Component {
  state = {
    trades: []
  };

  componentDidMount() {
    this.fetchTrades();
  }

  fetchTrades = () => {
    const { sessionInfo } = this.props;
    fetch(`http://127.0.0.1:8000/tmu/get_all_trades_info?trade_session_id=${sessionInfo.id}`)
      .then(response => response.json())
      .then(data => this.setState({ trades: data.data }))
      .catch(error => console.error('Error:', error));
  }

  handleTradeSelection = (trade_id) => {
    console.log("Trade Selected",trade_id)
  }

  render() {
    const { sessionInfo } = this.props;
    const { trades } = this.state;

    return (
      <div className="trade-session-details">
        <TradeSessionHeader sessionInfo={sessionInfo} />
        <TradeBar handleTradeSelection = {this.handleTradeSelection} trades={trades} /> {/* Pass the trades to the TradeBar component */}
        {/* Other sections will go here */}
      </div>
    );
  }
}

export default TradeSessionDetail;
