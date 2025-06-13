import React from 'react';
import TradeSession from './TradeSession/TradeSession';

class TradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '',
    };
  }

  render() {
    return (
      <div>
        <h1>Trade Management</h1>
        <TradeSession></TradeSession>
      </div>
    );
  }
}

export default TradeManagement;
