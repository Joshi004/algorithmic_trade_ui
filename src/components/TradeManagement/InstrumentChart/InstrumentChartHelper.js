export class InstrumentChartHelper {

static getChartOptions = (data,meta)=>{
        let options = {
            chart: {
              type: 'candlestick',
            },
            xaxis: {
              type: 'date'
            },
            tooltip: {
              enabled: true,
            },
            title:{
              text: `CandleStick Chart - ${meta.symbol}`,
              align: 'left',
              color : "red"
            },
            annotations: {
              xaxis: InstrumentChartHelper.getXaxisAnnotation(data),
              yaxis: InstrumentChartHelper.getYaxisAnnotation(data)
            }
          }
          return options
    }
  static getXaxisAnnotation = () => {
    return [
      {
        x: new Date("2022-07-01").getTime(),
        x2: new Date("2022-07-18").getTime(),
        borderColor: "#black",
        label: {
          borderColor: "#00E396",
          style: {
            color: "red",
            background: "#00E396",
          },
          text: "X annotation",
        },
      },
    ];
  };

  static getAnoObejectY = (y1, y2, color, anoText,position="right") => {
    return {
      y: y1,
      y2: y2 || null,
      borderColor: color,
      label: {
        borderColor: "#00E396",
        position:position,
        style: {
          color: "black",
          background: "#00E396",
        },
        text: anoText,
      },
    };
  };

  static getYaxisAnnotation = (data) => {
    let scopeAno = InstrumentChartHelper.getAnoObejectY(
    data.down_scope,
    data.up_scope,
      "#fff",
      "Scope OF Trade",
      "center"
    );
    let annotation_array = [scopeAno];

    let marketPrice = data.market_price;
    let marketPriceLine = InstrumentChartHelper.getAnoObejectY(
      marketPrice,
      null,
      "blue",
      `Current Price-  - ${marketPrice}`,
      "center"
    );

    annotation_array.push(marketPriceLine);

    if (data?.trading_pair?.support) {
      let support = data.trading_pair.support;
      let resistance = data.trading_pair.resistance;

      let supportLine = InstrumentChartHelper.getAnoObejectY(
        support,
        null,
        "green",
        `Support level - ${support}`
      );
      let resistanceLine = InstrumentChartHelper.getAnoObejectY(
        resistance,
        null,
        "red",
        `Resistance level - ${resistance}`
      );
      annotation_array.push(supportLine);
      annotation_array.push(resistanceLine);
    }
    return annotation_array;
  };
}
