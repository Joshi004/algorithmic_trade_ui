import React from 'react';
import TradeSession from './TradeSession/trade_session';
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
        <InstrumentChrt></InstrumentChrt>
        <TradeSession></TradeSession>
        {/* <Label>Price</Label>
        <Input type="text" value={this.state.price} onChange={this.handlePriceChange} />
        <Button onClick={this.sendData}>Submit Price</Button> */}
      </div>
    );
  }
}

export default TradeManagement;
