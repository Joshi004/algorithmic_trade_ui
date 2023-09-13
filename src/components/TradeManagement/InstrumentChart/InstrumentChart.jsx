import React from 'react';
import { Button, Form, Input, Label } from 'semantic-ui-react';
import './InstrumentChart.scss';

class InstrumentChrt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      symbol: '',
      interval: '',
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
      .then(data => this.setState({ data }))
      .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div className="container">
        <div className="form-container">
          <Form>
            <Form.Field>
              <Label>Start Date</Label>
              <Input type="date" name="startDate" onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>End Date</Label>
              <Input type="date" name="endDate" onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>Symbol</Label>
              <Input type="text" name="symbol" onChange={this.handleInputChange} />
            </Form.Field>
            <Form.Field>
              <Label>Interval</Label>
              <Input type="number" name="interval" onChange={this.handleInputChange} />
            </Form.Field>
            <Button onClick={this.fetchData}>Get Data</Button>
          </Form>
        </div>
        <div className="data-container">
          {/* Display the fetched data here */}
        </div>
      </div>
    );
  }
}

export default InstrumentChrt;
