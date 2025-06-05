import './InstrumentChart.scss';

import { Button, Form, Input, Label } from 'semantic-ui-react';

import CandlestickChart from './MyChart/CandlestickChart';
import ENDPOINTS from '../../../services/endpoints';
import { InstrumentChartHelper } from './InstrumentChartHelper';
import InstrumentSearchComponent from '../../Common/GenericInstrumentSearch/InstrumentSearch';
import React from 'react';
import apiService from '../../../services/apiService';

class InstrumentChrt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '2021-08-27',
      endDate: '2022-08-26',
      symbol: 'yesbank',
      interval: '1',
      data: null,
    };
  }

  handleInputChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  }

  fetchData = async () => {
    const { startDate, endDate, symbol, interval } = this.state;
    
    try {
      const url = `${ENDPOINTS.SCANNER_ALGOS.GET_UDTS_ELIGIBILITY}?symbol=${symbol}&trade_frequency=15-minute`;
      const data = await apiService.get(url);

      const transformedData = data.data.price_list.map(item => ({
        x: new Date(item.date),
        y: [item.open, item.high, item.low, item.close]
      }));

      this.setState({ 
        data: [{ data: transformedData }],
        deflectionPoints: data.data.deflection_points,
        upScope: data.data.up_scope,
        downScope: data.data.down_scope,
        tradingPair: data.data.trading_pair,
        marketPrice: data.data.market_price,
        options: InstrumentChartHelper.getChartOptions(data.data, data.meta)
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  handleInstrumentSelect = (e, selection) => {
    console.log("In Parent", e, selection);
  }

  render() {
    const candStickProps = {
      series: this.state.data,
      options: this.state.options
    }
    return (
      <div className="container">
        <div className="form-container">
          <InstrumentSearchComponent allowMultiple={false} onSelectionChange={this.handleInstrumentSelect}></InstrumentSearchComponent>
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
          {this.state.data?.length ? <CandlestickChart {...candStickProps}></CandlestickChart> : null}
        </div>
      </div>
    );
  }
}

export default InstrumentChrt;
