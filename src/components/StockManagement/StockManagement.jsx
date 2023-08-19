import React, { Component } from 'react';
import GenericTable from '../table/table';

class StockManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        columns : []
     };
  }

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
      <div>
        <h1>Stock Management</h1>
        <hr></hr>
        <GenericTable data={data} columns={columns} />
      </div>
    );
  }
}

export default StockManagement;
