import React from "react";
import Chart from "react-apexcharts";

class CandlestickChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          type: 'candlestick',
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          enabled: true,
        },
        title:{
          text: `CandleStick Chart - ${props.symbol}`,
          align: 'left'
        },
        annotations: {
          xaxis: [
            {
              x: new Date('2022-04-01 T00:00:00'),
              borderColor: '#black',
              label: {
                borderColor: '#00E396',
                style: {
                  color: '#aaa',
                  background: '#00E396',
                },
                text: 'X annotation',
              }
            }
          ],
          yaxis: [
            {
              y: 250,
              borderColor: '#00E396',
              label: {
                borderColor: '#00E396',
                style: {
                  color: '#fff',
                  background: '#00E396',
                },
                text: 'Y annotation',
              }
            }
          ]
        }
      },
    };
  }

  render() {

    return (
      <Chart options={this.state.options} series={this.props.series} type="candlestick"  height={850}  />
    );
  }
}

export default CandlestickChart;
