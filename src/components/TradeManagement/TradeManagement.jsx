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

  componentDidMount(){
    console.log("Trade Session Di Mount")
  }

  handlePriceChange = (e) => {
    this.setState({ price: e.target.value });
  }


  sendData = () => {
    fetch('http://127.0.0.1:8000/tmu/set_trade_price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ price: this.state.price })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  render() {
    return (
      <div>
        <h1>Trade Management</h1>
        <InstrumentChrt></InstrumentChrt>
        {/* <TradeSession></TradeSession> */}
        {/* <Label>Price</Label>
        <Input type="text" value={this.state.price} onChange={this.handlePriceChange} />
        <Button onClick={this.sendData}>Submit Price</Button> */}
      </div>
    );
  }
}

export default TradeManagement;
