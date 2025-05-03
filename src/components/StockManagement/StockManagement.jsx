// StockManagement.js

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import GenericTable from '../table/table';
import './StockManagement.scss'; // Import the SCSS file here
import SearchComponent from './SearchComponent/SearchComponent';
import Loader from '../Common/Loader/Loader';
import apiService from '../../services/apiService';
import ENDPOINTS from '../../services/endpoints';

class StockManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      lastUpdate: localStorage.getItem('lastUpdate') || 'Never',
      fetchingInstruments: false
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

  handleSearch = async (keyValuePair = {}) => {
    this.setState({ fetchingInstruments: true });
    try {
      const searchParams = this.getSearchString(keyValuePair);
      const url = `${ENDPOINTS.INSTRUMENTS.GET_ALL}?${searchParams}`;
      const res_data = await apiService.get(url);
      
      let data = res_data.data;
      let columns = Object.keys(data[0]);
      
      this.setState({ data, columns, fetchingInstruments: false });
    } catch (error) {
      console.error('Error fetching instruments:', error);
      this.setState({ fetchingInstruments: false });
    }
  }

  getSearchString = (parametersObject) => {
    let searchString = Object.keys(parametersObject)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parametersObject[key]))
      .join('&');
    return searchString;
  };

  async updateInstruments() {
    try {
      const data = await apiService.get(ENDPOINTS.INSTRUMENTS.UPDATE);
      console.log("Instruments updated", data);
      
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      localStorage.setItem('lastUpdate', timestamp);
      this.setState({ lastUpdate: timestamp });
    } catch (error) {
      console.error('There has been a problem updating instruments:', error);
    }
  }

  render() {
    const { data, columns, lastUpdate } = this.state;
    const searchProps = {
      defaultSelection: {
        exchange: "nse",
        instrument_type: "eq",
      },
      handleSearch: this.handleSearch,
      keys: this.keys,
      header: "Instrument Filter",
      isLoading: this.state.fetchingInstruments
    }
    return (
      <div>
        <h1>Stock Management</h1>
        <hr></hr>
        <Button onClick={this.updateInstruments} primary>Update Instruments</Button>
        <p className="update-time">Last updated: {lastUpdate}</p>
        <SearchComponent {...searchProps}></SearchComponent>
        <GenericTable data={data} columns={columns}></GenericTable>
      </div>
    );
  }
}

export default StockManagement;
