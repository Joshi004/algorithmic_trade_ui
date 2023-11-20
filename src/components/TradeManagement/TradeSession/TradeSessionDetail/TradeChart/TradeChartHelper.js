import {getISTDate} from "../../../../lib/Utils"
class TradeChartHelper {
  static getChartOptions = (dataPoints, historicalData) => {
    let datesList =
      historicalData && historicalData.length
        ? TradeChartHelper.extractDatesList(historicalData)
        : null;

    let options = {
      chart: {
        type: "candlestick",
        zoom: {
          enabled: true,
          type: "xy",
          autoScaleYaxis: true,
        },
      },
      xaxis: this.getXaxisOption(),
      yaxis: this.getYaxisOptions(),
      tooltip: {
        enabled: true,
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetX: 0,
          offsetY: 0,
        },
      },
      annotations: {
        xaxis: TradeChartHelper.getXaxisAnnotation(dataPoints, datesList),
        yaxis: TradeChartHelper.getYaxisAnnotation(dataPoints),
      },
      grid: this.getGridProperty(),
    };
    return options;
  };

  static getXaxisOption = () => {
    return {
      type: "date",
      tickAmount: 7,
      labels: {
        datetimeUTC: false,
        formatter: TradeChartHelper.getFormatedDate,
      },
      axisBorder: {
        show: true,
        color: "black",
      },
      title: {
        text: "Time",
        color: "black",
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: "#b6b6b6",
          width: 1,
          dashArray: 5,
        },
      },
    };
  };

  static getYaxisOptions = () => {
    return {
      show: true,
      showAlways: true,
      showForNullSeries: true,
      seriesName: undefined,
      opposite: true,
      forceNiceScale: true,
      tickAmount: 10,
      labels: {
        show: true,
        align: "right",
        minWidth: 0,
        maxWidth: 160,
        decimalsInFloat: 2,
        style: {
          colors: [],
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
        formatter: (value) => {
          return value;
        },
      },
      axisBorder: {
        show: true,
        color: "#78909C",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
        width: 6,
        offsetX: 0,
        offsetY: 0,
      },
      title: {
        text: "Price",
        rotate: -90,
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "black",
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: "#b6b6b6",
          width: 1,
          dashArray:5,
        },
      },
      tooltip: {
        enabled: true,
        offsetX: 0,
      },
    };
  };

  static getXaxisAnnotation = (dataPoints, datesList) => {
    let annotation_array = [];

    // Set Trade satrt time
    let startDateTime = dataPoints["trade_start_time"];
    if (startDateTime) {
      let normalisedDate = TradeChartHelper.getNormalisedDate(
        startDateTime,
        datesList
      );
      let time = TradeChartHelper.getFormatedDate(normalisedDate);
      let start_trade_line = TradeChartHelper.getAnoObejectX(
        time,
        null,
        "green",
        "Start Time"
      );
      annotation_array.push(start_trade_line);
    }
    // Set Trade End time
    if (dataPoints["trade_end_time"]) {
      let time = TradeChartHelper.getFormatedDate(dataPoints["trade_end_time"]);
      let start_trade_line = TradeChartHelper.getAnoObejectX(
        time,
        null,
        "red",
        "End Time"
      );
      annotation_array.push(start_trade_line);
    }

    return annotation_array;
  };

  static getYaxisAnnotation = (dataPoints) => {
    let annotation_array = [];
    let initiationPrice =
      dataPoints.trade_view === "long"
        ? dataPoints.buy_price
        : dataPoints.sell_price;
    let scopeAno = TradeChartHelper.getAnoObejectY(
      initiationPrice - dataPoints.movement_potential,
      initiationPrice + dataPoints.movement_potential,
      "#fff",
      "",
      "center"
    );
    annotation_array.push(scopeAno);

    // Set Buy Line
    if (dataPoints.buy_price) {
      let buyPrice = dataPoints.buy_price;
      let buyPriceLine = TradeChartHelper.getAnoObejectY(
        buyPrice,
        null,
        "#8bc60a",
        `Buy Price-  - ${buyPrice}`,
        "center"
      );
      annotation_array.push(buyPriceLine);
    }

    // Mark Sell price
    if (dataPoints.sell_price) {
      let sellPrice = dataPoints.sell_price;
      let sellPriceLine = TradeChartHelper.getAnoObejectY(
        sellPrice,
        null,
        "red",
        `Sell Price-  - ${sellPrice}`,
        "center"
      );
      annotation_array.push(sellPriceLine);
    }

    // #ca613d Current Price
    // Add Suport Price
    if (dataPoints.support_price) {
      let support = dataPoints.support_price;

      let supportLine = TradeChartHelper.getAnoObejectY(
        support,
        null,
        "#bbd301",
        `Support level - ${support}`,
        "right"
      );
      annotation_array.push(supportLine);
    }
    // Add Resistence Price
    if (dataPoints.resistance_price) {
      let resistance = dataPoints.resistance_price;
      let resistanceLine = TradeChartHelper.getAnoObejectY(
        resistance,
        null,
        "#ca613d",
        `Resistance level - ${resistance}`,
        "right"
      );
      annotation_array.push(resistanceLine);
    }

    // Add Resistence Price
    if (dataPoints.market_price) {
      let marketPrice = dataPoints.market_price;
      let marketLine = TradeChartHelper.getAnoObejectY(
        marketPrice,
        null,
        "yellow",
        `Resistance level - ${marketPrice}`,
        "left"
      );
      annotation_array.push(marketLine);
    }

    return annotation_array;
  };

  static getAnoObejectY = (y1, y2, color, anoText, position = "right") => {
    return {
      y: y1,
      y2: y2 || null,
      borderColor: color,
      strokeDashArray: 0,
      height: "8px",
      label: {
        borderColor: "#00E396",
        position: position,
        style: {
          color: "black",
          background: "#b4d8e8",
        },
        text: anoText,
      },
    };
  };

  static getAnoObejectX = (x1, x2, color, anoText, position = "top") => {
    return {
      x: x1,
      x2: x2 || null,
      borderColor: color,
      strokeDashArray: 1,
      label: {
        borderColor: "#00E396",
        position: position,
        style: {
          color: "black",
          background: "#b4d8e8",
        },
        text: anoText,
      },
    };
  };

  static getGridProperty = () => {
    return {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    };
  };

  static getFormatedDate = (value) => {
    let date = getISTDate(value);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    return `${month}-${day}::${hours}:${minutes}:${seconds}`;
  };

  static extractDatesList = (historicalData) => {
    let datesList = [];
    historicalData.forEach((dataGroup) => {
      dataGroup.data.forEach((day) => {
        datesList.push(day.x);
      });
    });
    // Sort the dates in ascending order
    datesList.sort((a, b) => new Date(a) - new Date(b));
    return datesList; // return the sorted datesList
  };

  static getNormalisedDate = (date, sortedDateList) => {
    if (!sortedDateList) {
      return null;
    }
    // Convert the input date to a timestamp
    let timestamp = new Date(date).getTime();

    // Initialize the start and end indices for the binary search
    let start = 0;
    let end = sortedDateList.length - 1;

    // While there are still dates to check
    while (start <= end) {
      // Calculate the middle index
      let mid = Math.floor((start + end) / 2);

      // Convert the middle date to a timestamp
      let midTimestamp = new Date(sortedDateList[mid]).getTime();

      // If the middle date is equal to the input date, return the date
      if (midTimestamp === timestamp) {
        return sortedDateList[mid];
      }

      // If the middle date is less than the input date, update the start index
      else if (midTimestamp < timestamp) {
        start = mid + 1;
      }

      // If the middle date is greater than the input date, update the end index
      else {
        end = mid - 1;
      }
    }

    // If the input date is not in the list, return the closest smaller date
    return sortedDateList[end];
  };
}

export default TradeChartHelper;
