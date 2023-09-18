import React from 'react';
import { Dropdown } from 'semantic-ui-react';

class InstrumentSearchComponent extends React.Component {
  state = {
    options: [
      { key: 1, text: 'Choice 1', value: 1 },
      { key: 2, text: 'Choice 2', value: 2 },
      { key: 3, text: 'Choice 3', value: 3 },
    ],
    value: [],
  };

  handleChange = (e, { value }) => this.setState({ value });

  render() {
    const { options, value } = this.state;

    return (
      <Dropdown
        fluid
        multiple
        search
        selection
        loading
        options={options}
        value={value}
        placeholder='Search...'
        onChange={this.handleChange}
      />
    );
  }
}

export default InstrumentSearchComponent;
