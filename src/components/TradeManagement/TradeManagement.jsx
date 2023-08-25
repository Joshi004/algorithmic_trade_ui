import React from 'react';
import TradeSession from './TradeSession/trade_session';
import { Button, Input, Label } from 'semantic-ui-react'

class TradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '',
    };
  }

  handlePriceChange = (e) => {
    this.setState({ price: e.target.value });
  }

   getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  sendData = () => {
    const csrftoken = this.getCookie('csrftoken');
    fetch('http://127.0.0.1:8000/tmu/set_trade_price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','X-CSRFToken': csrftoken },
      body: JSON.stringify({ price: this.state.price })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  render() {
    return (
      <div>
        <h1>Trade Management</h1>
        <TradeSession></TradeSession>
        <Label>Price</Label>
        <Input type="text" value={this.state.price} onChange={this.handlePriceChange} />
        <Button onClick={this.sendData}>Submit Price</Button>
      </div>
    );
  }
}

export default TradeManagement;
