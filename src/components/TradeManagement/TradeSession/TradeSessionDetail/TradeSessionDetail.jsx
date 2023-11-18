import React, { Component } from "react";
import TradeSessionHeader from "./TradeSessionHeader/TradeSessionHeader";
import TradeBar from "./TradeBar/TradeBar"; // Import the TradeBar component
import TradeChart from "./TradeChart/TradeChart"; // Import the InstrumentChart component
import "./TradeSessionDetail.scss";

class TradeSessionDetail extends Component {
  state = {
    trades: [],
    historicalData: [],
    selectedTrade: {},
  };

  componentDidMount() {
    this.fetchTrades();
    this.fetchHistoricalData();
    this.fetchUdtsRecord();
  }

  fetchTrades = () => {
    const { sessionInfo } = this.props;
    fetch(
      `http://127.0.0.1:8000/tmu/get_all_trades_info?trade_session_id=${sessionInfo.id}`
    )
      .then((response) => response.json())
      .then((data) => this.setState({ trades: data.data }))
      .catch((error) => console.error("Error:", error));
  };

  fetchHistoricalData = (instrumentId, tradeDate) => {
    // Replace the placeholders with the actual values
    const tradeFrequency = this.props.sessionInfo["trading_frequency"];
    const numberOfCandles = 200;
    fetch(
      `http://127.0.0.1:8000/tmu/get_historical_data?instrument_id=${instrumentId}&trade_frequency=${tradeFrequency}&number_of_candles=${numberOfCandles}&trade_date=${tradeDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.data.map((item) => ({
          x: new Date(item.date),
          y: [item.open, item.high, item.low, item.close],
        }));
        this.setState({ historicalData: [{ data: transformedData }] });
      })
      .catch((error) => console.error("Error:", error));
  };

  fetchUdtsRecord = (tradeId) => {
    // Replace the placeholder with the actual value
    fetch(`http://127.0.0.1:8000/tmu/get_udts_redcord?trade_id=${tradeId}`)
      .then((response) => response.json())
      .then((data) => this.setDataPoints(data.data, this.state.selectedTrade))
      .catch((error) => console.error("Error:", error));
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
    const { trades, historicalData, dataPoints } = this.state;

    return (
      <div className="trade-session-details">
        <TradeSessionHeader sessionInfo={sessionInfo} dataPoints={dataPoints}/>
        <div className="content">
          <div className="trade-bar-container">
            <TradeBar
              handleTradeSelection={this.handleTradeSelection}
              trades={trades}
            />
          </div>
          <div className="instrument-chart-container">
            {(historicalData.length && Object.keys(dataPoints).length) ? (
              <TradeChart
                historicalData={historicalData}
                dataPoints={dataPoints}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default TradeSessionDetail;
