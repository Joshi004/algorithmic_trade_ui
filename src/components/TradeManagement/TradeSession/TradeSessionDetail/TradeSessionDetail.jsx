import "./TradeSessionDetail.scss";

import React, { Component } from "react";

import ENDPOINTS from "../../../../services/endpoints";
import { Loader } from "semantic-ui-react";
import TradeBar from "./TradeBar/TradeBar"; // Import the TradeBar component
import TradeChart from "./TradeChart/TradeChart"; // Import the InstrumentChart component
import TradeSessionHeader from "./TradeSessionHeader/TradeSessionHeader";
import apiService from "../../../../services/apiService";
import { getISTDate } from "../../../lib/Utils";

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
    this.fetchTradeSessionsInfo();
    this.fetchUdtsRecord();
  }

  fetchTradeSessionsInfo = async () => {
    try {
      const { tradeSessionID } = this.props;
      const url = `${ENDPOINTS.TRADE_SESSIONS.GET_ALL}?user_id=1&dummy=1&session_id=${tradeSessionID}`;
      const data = await apiService.get(url);
      
      const sessionInfo = { ...data.data.trade_sessions[0] };
      this.setState({ sessionInfo, tradeFrequency: sessionInfo["trading_frequency"] }, () => {
        this.fetchTrades();
      });
    } catch (error) {
      console.error("Error fetching trade session info:", error);
    }
  };

  fetchTrades = async () => {
    this.setState({ tradesLoading: true });
    try {
      const { tradeSessionID } = this.props;
      const url = `${ENDPOINTS.TRADES.GET_ALL_TRADES_INFO}?trade_session_id=${tradeSessionID}`;
      const data = await apiService.get(url);
      
      this.setState({ trades: data.data }, () => {
        if (this.state.trades.length) {
          this.handleTradeSelection(this.state.trades[0]);
        }
      });
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      this.setState({ tradesLoading: false });
    }
  };

  fetchHistoricalData = async (instrumentId, tradeDate) => {
    if (!instrumentId) return;

    this.setState({ historicalDataLoading: true });
    try {
      const tradeFrequency = this.state.tradeFrequency || this.state.sessionInfo["trading_frequency"];
      const numberOfCandles = 200;
      const url = `${ENDPOINTS.INSTRUMENTS.GET_HISTORICAL_DATA}?instrument_id=${instrumentId}&trade_frequency=${tradeFrequency}&number_of_candles=${numberOfCandles}&trade_date=${tradeDate}`;
      
      const data = await apiService.get(url);
      
      const transformedData = data.data.map((item) => ({
        x: getISTDate(item.date),
        y: [item.open, item.high, item.low, item.close],
      }));
      
      this.setState({ historicalData: [{ data: transformedData }] });
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      this.setState({ historicalDataLoading: false });
    }
  };

  fetchUdtsRecord = async (tradeId) => {
    if (!tradeId) return;
    
    this.setState({ dataPointsLoading: true });
    try {
      const url = `${ENDPOINTS.SCANNER_ALGOS.GET_UDTS_RECORD}?trade_id=${tradeId}`;
      const data = await apiService.get(url);
      
      this.setDataPoints(data.data, this.state.selectedTrade);
    } catch (error) {
      console.error("Error fetching UDTS record:", error);
    } finally {
      this.setState({ dataPointsLoading: false });
    }
  };

  upadteFreqyency = (value) => {
    let now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    let dateTime = now.toISOString().split(".")[0];
    let instrumentId = this.state.selectedTrade.instrument["instrument_id"];
    
    this.setState({ tradeFrequency: value }, () => {
      this.fetchHistoricalData(instrumentId, dateTime);
    });
  }

  handleTradeSelection = (trade) => {
    let now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    let dateTime = now.toISOString().split(".")[0]; 
    
    this.setState({ selectedTrade: trade }, () => {
      this.fetchUdtsRecord(trade["trade_id"]);
      this.fetchHistoricalData(trade["instrument"]["instrument_id"], dateTime);
    });
  };

  setDataPoints(udtsRecord, trade) {
    let dataPoints = { ...udtsRecord, ...trade };
    this.setState({ dataPoints: dataPoints });
  }

  render() {
    const {
      sessionInfo,
      selectedTrade,
      dataPointsLoading,
      historicalDataLoading,
      tradesLoading,
      trades,
      historicalData,
      dataPoints,
      tradeFrequency
    } = this.state;
    const instrumentId = selectedTrade?.instrument?.instrument_id;

    return (
      <div className="trade-session-details">
        <div className="header-container">
          {dataPointsLoading ? (
            <Loader active inline="centered" />
          ) : (
            <TradeSessionHeader
              sessionInfo={sessionInfo}
              dataPoints={dataPoints}
              updateFrequency={this.upadteFreqyency}
              currentFrequency={tradeFrequency}
              sessionParameters={this.props.sessionParameters}
              parametersLoading={this.props.parametersLoading}
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
