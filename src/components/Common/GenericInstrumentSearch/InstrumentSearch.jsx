import React from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import './InstrumentSearch.scss';

class InstrumentSearchComponent extends React.Component {
  state = {
    options: [],
    value: [],
    searchQuery: '',
    selectedOption: null,
  };

  handleChange = (e, { value }) => {
    const selectedOption = this.state.options.find(option => option.value === value);
    this.setState({ value, selectedOption });
    const { allowMultiple } = this.props;
    let selectedOptions;

    // Check if multiple selections are allowed
    if (allowMultiple) {
      selectedOptions = this.state.options.filter(option => value.includes(option.value));
      this.setState({ value, selectedOption: selectedOptions });
    } else {
      selectedOptions = this.state.options.find(option => option.value === value);
      this.setState({ value: selectedOptions.value, selectedOption });
    }

    // Call the onSelectionChange prop with the data of the selected options
    if (this.props.onSelectionChange) {
      let selectedData = Array.isArray(selectedOptions)
        ? selectedOptions.map(option => option.data)
        : [selectedOptions.data];
      this.props.onSelectionChange(selectedData);
    }
  };

  handleSearchChange = (e, { searchQuery }) => {
    this.setState({ searchQuery });

    // Clear the previous timer if it exists
    if (this.timer) clearTimeout(this.timer);

    // Set a new timer
    this.timer = setTimeout(this.fetchOptions, 1000);

    // Clear the options if the search input is empty
    if (searchQuery === '') {
      this.setState({ options: [] });
    }
  };

  fetchOptions = () => {
    this.setState({ loading: true });

    const { searchQuery } = this.state;

    const url = new URL('http://127.0.0.1:8000/tmu/get_instruments');
    const params = {
      trading_symbol: searchQuery,
      name: searchQuery,
      page_length: 5,
      sort_type: 'asc',
      page_no: 1,
      order_by: 'name',
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const options = data.data.map((instrument) => ({
          key: instrument.instrument_token,
          text: `${instrument.instrument_type} - ${instrument.name} - ${instrument.exchange}`,
          value: instrument.instrument_token,
          content: (
            <Grid className="custom-dropdown-item" verticalAlign='middle'>
              <Grid.Column floated='left' width={13}>
                {`${instrument.instrument_type} - ${instrument.name}`}
              </Grid.Column>
              <Grid.Column floated='right' width={3}>
                {instrument.exchange}
              </Grid.Column>
            </Grid>
          ),
          data: instrument, // Store the entire instrument object in the option
        }));

        this.setState({ options, loading: false });
      })
      .catch(error => {
        console.error('Error:', error);
        this.setState({ loading: false });
      });
  };

  render() {
    const { options, value, searchQuery, selectedOption, loading } = this.state;
    const { allowMultiple } = this.props;

    return (
      <Dropdown
        fluid
        multiple={allowMultiple}
        search
        selection
        loading={loading}
        options={options}
        value={allowMultiple ? value : (selectedOption ? selectedOption.value : '')}
        placeholder='Search Trade Instrument'
        onChange={this.handleChange}
        onSearchChange={this.handleSearchChange}
        className="custom-dropdown"
      />
    );
  }
}

export default InstrumentSearchComponent;
