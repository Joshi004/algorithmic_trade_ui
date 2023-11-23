import React, { Component } from "react";
import TradeSessionHeader from "./TradeSessionHeader/TradeSessionHeader";
import {getISTDate} from "../../../lib/Utils"
import TradeBar from "./TradeBar/TradeBar"; // Import the TradeBar component
import TradeChart from "./TradeChart/TradeChart"; // Import the InstrumentChart component
import { Loader } from "semantic-ui-react";
import "./TradeSessionDetail.scss";
import {urls} from "../../../constants/urls"

class TradeSessionDetail extends Component {
  state = {
    trades: [],
    historicalData: [],
    selectedTrade: {},
    tradesLoading: true,
    historicalDataLoading: true,
    dataPointsLoading: true,
  };

  componentDidMount() {
    this.fetchTrades();
    this.fetchHistoricalData();
    this.fetchUdtsRecord();

    // setInterval(()=>{
    //   this.fetchTrades();
    //   this.fetchHistoricalData();
    //   this.fetchUdtsRecord();
    // },15*1000)
  }

  fetchTrades = () => {
    this.setState({ tradesLoading: true });
    const { sessionInfo } = this.props;
    fetch(
      `http://127.0.0.1:8000/tmu/get_all_trades_info?trade_session_id=${sessionInfo.id}`
    )
      .then((response) => response.json())
      .then((data) => this.setState({ trades: data.data }))
      .catch((error) => console.error("Error:", error))
      .finally(() => this.setState({ tradesLoading: false }));
  };

  fetchHistoricalData = (instrumentId, tradeDate) => {
    if(!instrumentId) return
  
    this.setState({ historicalDataLoading: true });
    // Replace the placeholders with the actual values
    const tradeFrequency = this.props.sessionInfo["trading_frequency"];
    const numberOfCandles = 200;
    fetch(
      `http://127.0.0.1:8000/tmu/get_historical_data?instrument_id=${instrumentId}&trade_frequency=${tradeFrequency}&number_of_candles=${numberOfCandles}&trade_date=${tradeDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.data.map((item) => ({
          x: getISTDate(item.date),
          y: [item.open, item.high, item.low, item.close],
        }));
        this.setState({ historicalData: [{ data: transformedData }] });
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => this.setState({ historicalDataLoading: false }));
  };

  fetchUdtsRecord = (tradeId) => {
    if(!tradeId) return
    this.setState({ dataPointsLoading: true });
    // Replace the placeholder with the actual value
    fetch(`http://127.0.0.1:8000/tmu/get_udts_redcord?trade_id=${tradeId}`)
      .then((response) => response.json())
      .then((data) => this.setDataPoints(data.data, this.state.selectedTrade))
      .catch((error) => console.error("Error:", error))
      .finally(() => this.setState({ dataPointsLoading: false }));
  };

  handleTradeSelection = (trade) => {
    this.setState({ selectedTrade: trade });
    let now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    let dateTime = now.toISOString().split(".")[0];
    this.fetchUdtsRecord(trade["trade_id"]);
    this.fetchHistoricalData(trade["instrument"]["instrument_id"], dateTime);
  };

  setDataPoints(udtsRecord, trade) {
    let dataPoints = { ...udtsRecord, ...trade };
    this.setState({ dataPoints: dataPoints });
  }

  render() {
    const { sessionInfo } = this.props;
    const {
      dataPointsLoading,
      historicalDataLoading,
      tradesLoading,
      trades,
      historicalData,
      dataPoints,
    } = this.state;

    return (
      <div className="trade-session-details">
        <div className="header-container">
          {dataPointsLoading ? (
            <Loader active inline="centered" />
          ) : (
            <TradeSessionHeader
              sessionInfo={sessionInfo}
              dataPoints={dataPoints}
            />
          )}
        </div>
        <div className="content">
          <div className="trade-bar-container">
            {tradesLoading ? (
              <Loader active inline="centered" />
            ) : (
              <TradeBar
                handleTradeSelection={this.handleTradeSelection}
                trades={trades}
              />
            )}
          </div>
          <div className="instrument-chart-container">
            {historicalData.length && Object.keys(dataPoints).length ? (
              historicalDataLoading || dataPointsLoading ? (
                <Loader active inline="centered" />
              ) : (
                <TradeChart
                  historicalData={historicalData}
                  dataPoints={dataPoints}
                />
              )
            ) : (
              <div>Please Select A Trade to see the chart</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TradeSessionDetail;
