import React, { Component } from "react";
import Chart from "react-apexcharts";
import TradeChartHelper from "./TradeChartHelper";

class TradeChart extends Component {
  getChartOption = () => {};
  render() {
    const { historicalData, dataPoints } = this.props;
    const options = TradeChartHelper.getChartOptions(dataPoints,this.props.historicalData);
    return (
      <div className="container">
        <div className="data-container">
          <div>
            {historicalData.length ? (
              <Chart
                options={options}
                series={historicalData}
                type="candlestick"
                height={"800px"}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default TradeChart;
