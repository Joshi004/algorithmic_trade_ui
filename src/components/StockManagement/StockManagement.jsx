// StockManagement.js

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import GenericTable from '../table/table';
import './StockManagement.scss'; // Import the SCSS file here
import SearchComponent from './SearchComponent/SearchComponent';
import Loader from '../Common/Loader/Loader';

class StockManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        columns : [],
        lastUpdate: localStorage.getItem('lastUpdate') || 'Never',
        fetchingInstruments : false
     };
     this.keys = [
      'instrument_token',
      'exchange_token',
      'trading_symbol',
      'name',
      'last_price',
      'expiry',
      'strike',
      'tick_size',
      'lot_size',
      'instrument_type',
      'segment',
      'exchange'
    ];

     this.updateInstruments = this.updateInstruments.bind(this);
  }



  handleSearch = (keyValuePair={}) => {
    this.setState({fetchingInstruments:true})
    let searchParams = this.getSearchString(keyValuePair)
    let url = 'http://127.0.0.1:8000/tmu/get_instruments?' + searchParams
    fetch(url)
      .then(response => response.json())
      .then((res_data) => {
        console.log("res_data",res_data)
        let data = res_data.data
        let columns = Object.keys(data[0])
        console.log("data", data)
        this.setState({ data, columns, fetchingInstruments:false })
      })
      .catch((error) => {
        console.error('Error:', error);
        this.setState({fetchingInstruments:false})
      });
  }
  


  getSearchString = (parametersObject) =>{
    let searchString = Object.keys(parametersObject)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parametersObject[key]))
      .join('&');
    return searchString
  };
  

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
    const searchProps = {
      defaultSelection : {
        exchange : "nse",
        instrument_type : "eq",
      },
      handleSearch: this.handleSearch,
      keys:this.keys,
      header : "Instrument Filter",
      isLoading : this.state.fetchingInstruments
    }
    return (
      <div>
        <h1>Stock Management</h1>
        <hr></hr>
        <Button onClick={this.updateInstruments} primary>Update Instruments</Button>
        <p className="update-time">Last updated: {lastUpdate}</p>
        <SearchComponent  {...searchProps} ></SearchComponent>
         <GenericTable data={data} columns={columns}></GenericTable>
      </div>
    );
  }
}

export default StockManagement;
