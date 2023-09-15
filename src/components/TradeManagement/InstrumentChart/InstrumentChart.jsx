import React from 'react';
import { Button, Form, Input, Label } from 'semantic-ui-react';
import './InstrumentChart.scss';
import CandlestickChart from './MyChart/CandlestickChart';

class InstrumentChrt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '2021-08-27',
      endDate: '2022-08-26',
      symbol: 'itc',
      interval: '1',
      data: null,
    };
  }

  handleInputChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  }

  fetchData = () => {
    const { startDate, endDate, symbol, interval } = this.state;
    const url = `http://127.0.0.1:8000/tmu/fetch_historical_data?start_date=${startDate}&end_date=${endDate}&symbol=${symbol}&interval=${interval}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.data.map(item => ({
          x: new Date(item.date),
          y: [item.open, item.high, item.low, item.close]
        }));

        this.setState({ data: [{ data: transformedData }] });
      })
      .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div className="container">
        <div className="form-container">
          <Form>
            <Form.Field>
              <Label>Start Date</Label>
              <Input type="date" name="startDate" value={this.state.startDate} onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>End Date</Label>
              <Input type="date" name="endDate" value={this.state.endDate} onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>Symbol</Label>
              <Input type="text" name="symbol" value={this.state.symbol} onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>Interval</Label>
              <Input type="number" name="interval" value={this.state.interval} onChange={this.handleInputChange} />
            </Form.Field>
            <Button onClick={this.fetchData}>Get Data</Button>
          </Form>
        </div>
        <div className="data-container">
          {this.state.data?.length ? <CandlestickChart symbol = {this.state.symbol} series={this.state.data}></CandlestickChart>: null}
        </div>
      </div>
    );
  }
}

export default InstrumentChrt;
