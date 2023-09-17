import React from "react";
import Chart from "react-apexcharts";

class CandlestickChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

 
  render() {
    return (
      <Chart options={this.props.options} series={this.props.series} type="candlestick"  height={850}  />
    );
  }
}

export default CandlestickChart;
