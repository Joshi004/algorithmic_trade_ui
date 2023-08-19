import React, { Component } from 'react';
import GenericTable from '../table/table';
import TradeSession from '../TradeSession/trade_session';
import { Link,BrowserRouter } from 'react-router-dom';
import './home.scss';

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
        <div className="container">
          <BrowserRouter>
            <Link to="/asset-management" className="box">Asset Management</Link>
            <Link to="/investment-management" className="box">Investment Management</Link>
            <Link to="/expense-management" className="box">Expense Management</Link>
            <Link to="/trade-management" className="box">Trade Management</Link>
            <Link to="/algorithm-management" className="box">Algorithm Management</Link>
            <Link to="/stock-management" className="box">Stock Management</Link>
          </BrowserRouter>
        </div>
        {/* <h3>NSE Listed Securites</h3> */}
        {/* <hr></hr> */}
        {/* <TradeSession></TradeSession> */}
        {/* <GenericTable data={data} columns={columns} /> */}
      </div>
    );
  }
}

export default Home;
