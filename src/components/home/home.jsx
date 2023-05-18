import React, { Component } from 'react';
import GenericTable from '../table/table';
import TradeSession from '../TradeSession/trade_session';

class Home extends Component {
  state = {
     data: [],
     columns : []
  };

  componentDidMount() {
    fetch('http://127.0.0.1:8000/tmu/get_all_stocks')
      .then(response => response.json())
      .then((data)=>{
        data= data.map(data=> data.fields)
        let columns = Object.keys(data[0])
        console.log("response fetched ",data)
        this.setState({ data,columns })
      });
  }

  render() {
    const { data,columns } = this.state;
    return (
      <div className="App">
        <h3>NSE Listed Securites</h3>
        <hr></hr>
        <TradeSession></TradeSession>
        <GenericTable data={data} columns={columns} />
      </div>
    );
  }
}

export default Home;
