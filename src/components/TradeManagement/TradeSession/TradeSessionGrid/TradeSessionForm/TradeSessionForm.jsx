import React, { Component } from "react";
import { Form, Dropdown,Button, Checkbox, Message} from "semantic-ui-react";

class TradeSessionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanningAlgorithm: "",
      trackingAlgorithm: "",
      tradingFrequency: "",
      isDummy: true,
      scanningOptions: [],
      trackingOptions: [],
      frequencyOptions: [],
      scanningDescription: "",
      trackingDescription: "",
    };
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/tmu/get_new_session_param_options')
      .then(response => response.json())
      .then(data => {
        const scanningOptions = data.scanning_algorithms.map(algo => ({
          key: algo.name,
          value: algo.name,
          text: algo.display_name,
          description : algo.description
        }));
        const trackingOptions = data.tracking_algorithms.map(algo => ({
          key: algo.name,
          value: algo.name,
          text: algo.display_name,
          description : algo.description
        }));
        const frequencyOptions = data.trading_frequencies.map(freq => ({
          key: freq,
          value: freq,
          text: freq,
        }));
        this.setState({ scanningOptions, trackingOptions, frequencyOptions });
      });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  
    // update the description when an algorithm is selected
    if (name === 'scanningAlgorithm') {
      const selectedAlgo = this.state.scanningOptions.find(algo => algo.value === value);
      if (selectedAlgo) {
        this.setState({ scanningDescription: selectedAlgo.description });
      }
    } else if (name === 'trackingAlgorithm') {
      const selectedAlgo = this.state.trackingOptions.find(algo => algo.value === value);
      if (selectedAlgo) {
        this.setState({ trackingDescription: selectedAlgo.description });
      }
    }
  };
  

  handleCheckboxChange = (e, { name, checked }) =>
    this.setState({ [name]: checked });

  handleSubmit = () => {
    // pass the state to the parent component
    this.props.onSubmit(this.state);
  };

  render() {
    const { scanningAlgorithm, trackingAlgorithm, tradingFrequency, isDummy, scanningOptions, trackingOptions, frequencyOptions, scanningDescription, trackingDescription } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field>
          <label>Scanning Algorithm Name</label>
          <Dropdown
            placeholder='Select Scanning Algorithm'
            fluid
            selection
            options={scanningOptions}
            name='scanningAlgorithm'
            value={scanningAlgorithm}
            onChange={this.handleChange}
          />
          {scanningDescription && <Message info>{scanningDescription}</Message>}
        </Form.Field>
        <Form.Field>
          <label>Tracking Algorithm Name</label>
          <Dropdown
            placeholder='Select Tracking Algorithm'
            fluid
            selection
            options={trackingOptions}
            name='trackingAlgorithm'
            value={trackingAlgorithm}
            onChange={this.handleChange}
          />
          {trackingDescription && <Message info>{trackingDescription}</Message>}
        </Form.Field>
        <Form.Field>
          <label>Trading Frequency</label>
          <Dropdown
            placeholder='Select Trading Frequency'
            fluid
            selection
            options={frequencyOptions}
            name='tradingFrequency'
            value={tradingFrequency}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Dummy'
            name='isDummy'
            checked={isDummy}
            onChange={this.handleCheckboxChange}
          />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    );
  }
}

export default TradeSessionForm;
