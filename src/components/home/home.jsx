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
    console.log("Home Componet")
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
      <div className="Home">
        <div className="container">
          <h1>ATS Application</h1>
          <hr></hr>

            <Link to="/asset-management" className="box">Asset Management</Link>
            <Link to="/investment-management" className="box">Investment Management</Link>
            <Link to="/expense-management" className="box">Expense Management</Link>
            <Link to="/trade-management" className="box">Trade Management</Link>
            <Link to="/algorithm-management" className="box">Algorithm Management</Link>
            <Link to="/stock-management" className="box">Stock Management</Link>

        </div>

        {/* <TradeSession></TradeSession> */}
        {/* <GenericTable data={data} columns={columns} /> */}
      </div>
    );
  }
}

export default Home;
