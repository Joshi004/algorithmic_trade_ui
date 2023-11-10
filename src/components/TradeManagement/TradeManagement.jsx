import React from 'react';
import TradeSession from './TradeSession/TradeSession';
import { Button, Input, Label } from 'semantic-ui-react'
import InstrumentChrt from './InstrumentChart/InstrumentChart';
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
        {/* <InstrumentChrt></InstrumentChrt> */}
        <TradeSession></TradeSession>
      </div>
    );
  }
}

export default TradeManagement;
