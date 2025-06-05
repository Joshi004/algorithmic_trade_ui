import "./TradeSessionHeader.scss";

import React, { Component } from "react";

import { Card } from "semantic-ui-react";
import { Dropdown } from "semantic-ui-react";

class TradeSessionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frequencyOptions: [],
      loadingOptions: true
    };
  }

  async componentDidMount() {
    this.processFrequencyOptions();
  }

  componentDidUpdate(prevProps) {
    // Update options when sessionParameters prop changes
    if (prevProps.sessionParameters !== this.props.sessionParameters ||
        prevProps.parametersLoading !== this.props.parametersLoading) {
      this.processFrequencyOptions();
    }
  }

  processFrequencyOptions = () => {
    const { sessionParameters, parametersLoading } = this.props;
    
    if (parametersLoading) {
      this.setState({ loadingOptions: true });
      return;
    }

    if (!sessionParameters || !sessionParameters.trading_frequencies) {
      console.error("No frequency options available from session parameters");
      this.setState({ 
        frequencyOptions: [],
        loadingOptions: false 
      });
      return;
    }

    try {
      const frequencyOptions = sessionParameters.trading_frequencies.map(freq => ({
        key: freq,
        text: this.formatFrequencyText(freq),
        value: freq
      }));
      
      this.setState({ 
        frequencyOptions,
        loadingOptions: false 
      });
    } catch (error) {
      console.error("Error processing frequency options:", error);
      this.setState({ 
        frequencyOptions: [],
        loadingOptions: false 
      });
    }
  }

  formatFrequencyText = (freq) => {
    // Convert frequency values to user-friendly text
    const formatMap = {
      '1-minute': '1 Minute',
      '3-minute': '3 Minute',
      '5-minute': '5 Minute',
      '10-minute': '10 Minute',
      '15-minute': '15 Minute',
      '30-minute': '30 Minute',
      '60-minute': '60 Minute',
      '1-day': '1 Day'
    };
    
    return formatMap[freq] || freq.charAt(0).toUpperCase() + freq.slice(1);
  }

  renderFrequencyDropDown = () => {
    const { currentFrequency } = this.props;
    const { frequencyOptions, loadingOptions } = this.state;
    
    // If no options available (API failure), show disabled dropdown
    const isDisabled = !loadingOptions && frequencyOptions.length === 0;
    const placeholder = isDisabled ? "No frequencies available" : "Select Frequency";
    
    return (
      <Dropdown
        placeholder={placeholder}
        fluid
        selection
        loading={loadingOptions}
        disabled={isDisabled}
        value={currentFrequency}
        options={frequencyOptions}
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
              Session ID: {sessionInfo.id} ({sessionInfo.status}) | | 
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
              {sessionInfo.scanning_algorithm_name}-{sessionInfo.tracking_algorithm_name}
            </Card.Description>
          </span>
          <span className="meta-span">
            <Card.Meta>
              | {dataPoints?.trade_id ? dataPoints["trade_id"] : null} |
              Friction {dataPoints?.total_frictional_loss} | Strength(S X R) : {dataPoints?.support_strength} X {dataPoints?.resistance_strength}
            </Card.Meta>
          </span>
        </Card.Content>
      </Card>
    );
  }
}

export default TradeSessionHeader;
