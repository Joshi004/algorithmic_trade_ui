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
              x: new Date('2022-07-01').getTime(),
              x2: new Date('2022-07-18').getTime(),
              borderColor: '#black',
              label: {
                borderColor: '#00E396',
                style: {
                  color: 'red',
                  background: '#00E396',
                },
                text: 'X annotation',
              }
            }
          ],
          yaxis: [
            {
              y: 250,
              y2:280,
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
