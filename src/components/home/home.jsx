import React, { Component } from "react";
import { Link, BrowserRouter } from "react-router-dom";
import bgImage from "../../images/image01.jpeg";
import "./home.scss";
import { Icon } from "semantic-ui-react";

class Home extends Component {
  componentDidMount() {
    console.log("Component Did mount  - Home");
  }

  render() {
    return (
      <div style={{ backgroundImage: `url(${bgImage})` }} className="Home">
        <Link>
          <div className="appheader">
            <Icon name="line graph"></Icon>Algorithmic Trading System{" "}
          </div>
        </Link>
        <hr></hr>
        <div className="container">
          {/* <img className="bgImage" src={bgImage} alt=""></img> */}
          <Link to="/profile-management" className="card">
            Profile Management
          </Link>
          <Link to="/investment-management" className="card">
            Investment Management
          </Link>
          <Link to="/expense-management" className="card">
            Expense Management
          </Link>
          <Link to="/trade-management" className="card">
            Trade Management
          </Link>
          <Link to="/algorithm-management" className="card">
            Algorithm Management
          </Link>
          <Link to="/stock-management" className="card">
            Stock Management
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
