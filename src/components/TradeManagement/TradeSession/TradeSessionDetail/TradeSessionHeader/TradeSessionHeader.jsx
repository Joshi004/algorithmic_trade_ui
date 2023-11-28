import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import "./TradeSessionHeader.scss";
import { Dropdown } from "semantic-ui-react";

class TradeSessionHeader extends Component {
  renderFrequencyDropDown = () => {
    const { currentFrequency } = this.props;
    return (
      <Dropdown
        placeholder="Select Frequency"
        fluid
        selection
        value={currentFrequency}
        options={[
          { key: "minute", text: "1 Minute", value: "minute" },
          { key: "3minute", text: "3 Minute", value: "3minute" },
          { key: "5minute", text: "5 Minute", value: "5minute" },
          { key: "10minute", text: "10 Minute", value: "10minute" },
          { key: "15minute", text: "15 Minute", value: "15minute" },
          { key: "day", text: "1 Day", value: "day" },
        ]}
        onChange={(e, { value }) => {
          this.props.updateFrequency(value);
        }}
      />
    );
  };

  render() {
    const { sessionInfo, dataPoints } = this.props;
    return (
      <Card fluid>
        <Card.Content className="trade-session-header">
          <span className="header-span">
            <Card.Header>
              ID: {sessionInfo.id} | Profit: {sessionInfo.net_profit} |
              {sessionInfo.status}
              {dataPoints?.instrument
                ? dataPoints["instrument"]["instrument_name"]
                : null}
            </Card.Header>
          </span>

          <span className="description-span">
            <Card.Description>
              <span className="frequencyDDSpan">
                {this.renderFrequencyDropDown()}
              </span>
              {sessionInfo.scanning_algorithm_name} | Tracking:{" "}
              {sessionInfo.tracking_algorithm_name}
            </Card.Description>
          </span>
          <span className="meta-span">
            <Card.Meta>
              | {dataPoints?.trade_id ? dataPoints["trade_id"] : null} |
              Started: {new Date(sessionInfo.started_at).toLocaleDateString()}
            </Card.Meta>
          </span>
        </Card.Content>
      </Card>
    );
  }
}

export default TradeSessionHeader;
