import React, { Component } from 'react';
import { Link,BrowserRouter } from 'react-router-dom';
import './home.scss';

class Home extends Component {

  componentDidMount(){
    console.log("Component Did mount  - Home")
  }
  
  render() {
    return (
      <div className="Home">
        <h1>ATS Application</h1>
        <hr></hr>
        <div className="container">

            <Link to="/profile-management" className="card">Profile Management</Link>
            <Link to="/investment-management" className="card">Investment Management</Link>
            <Link to="/expense-management" className="card">Expense Management</Link>
            <Link to="/trade-management" className="card">Trade Management</Link>
            <Link to="/algorithm-management" className="card">Algorithm Management</Link>
            <Link to="/stock-management" className="card">Stock Management</Link>

        </div>
      </div>
    );
  }
}

export default Home;
