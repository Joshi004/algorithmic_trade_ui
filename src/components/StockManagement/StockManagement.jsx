// StockManagement.js

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import GenericTable from '../table/table';
import './StockManagement.scss'; // Import the SCSS file here
import SearchComponent from './SearchComponent/SearchComponent';

class StockManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        columns : [],
        lastUpdate: localStorage.getItem('lastUpdate') || 'Never'
     };
     this.updateInstruments = this.updateInstruments.bind(this);
  }



  componentDidMount() {
    console.log("Home Componet")
    fetch('http://127.0.0.1:8000/tmu/get_instruments?exchange=nse')
      .then(response => response.json())
      .then((data)=>{
        data= data.map(data=> data.fields)
        let columns = Object.keys(data[0])
        console.log("response fetched ",data)
        this.setState({ data,columns })
      });
  }

  updateInstruments() {
    fetch('http://127.0.0.1:8000/tmu/update_instruments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data)=>{
        console.log("Instruments updated", data);
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        localStorage.setItem('lastUpdate', timestamp);
        this.setState({ lastUpdate: timestamp });
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  render() {
    const { data,columns,lastUpdate } = this.state;
    return (
      <div>
        <h1>Stock Management</h1>
        <hr></hr>
        <Button onClick={this.updateInstruments} primary>Update Instruments</Button>
        <p className="update-time">Last updated: {lastUpdate}</p>
        <SearchComponent></SearchComponent>
        <GenericTable data={data} columns={columns} />
      </div>
    );
  }
}

export default StockManagement;
