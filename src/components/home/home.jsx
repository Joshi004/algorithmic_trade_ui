import React, { Component } from 'react';
import GenericTable from '../table/table';
import TradeSession from '../TradeManagement/TradeSession/trade_session';
import { Link,BrowserRouter } from 'react-router-dom';
import './home.scss';

class Home extends Component {

  componentDidMount(){
    console.log("Component Did mount  - Home")
  }
  
  render() {
    return (
      <div className="Home">
        <div className="container">
          <h1>ATS Application</h1>
          <hr></hr>

            <Link to="/profile-management" className="box">Profile Management</Link>
            <Link to="/investment-management" className="box">Investment Management</Link>
            <Link to="/expense-management" className="box">Expense Management</Link>
            <Link to="/trade-management" className="box">Trade Management</Link>
            <Link to="/algorithm-management" className="box">Algorithm Management</Link>
            <Link to="/stock-management" className="box">Stock Management</Link>

        </div>
      </div>
    );
  }
}

export default Home;
