import React from 'react';
import Select from 'react-select';
import { Icon } from 'semantic-ui-react';
import './SearchComponent.scss';

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyValuePairs: {},
      key: '',
      value: '',
      error: null,
    };
    this.keyOptions = ['Option1', 'Option2', 'Option3'].map(option => ({ value: option, label: option })); // predefined list of keys
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleKeyChange = (selectedOption) => {
    this.setState({
      key: selectedOption.value,
    });
  };

  handleAddClick = () => {
    const { key, value, keyValuePairs } = this.state;
    if (key && value && !keyValuePairs[key]) {
      this.setState({
        keyValuePairs: { ...keyValuePairs, [key]: value },
        key: '',
        value: '',
        error: null,
      });
    } else {
      this.setState({ error: 'Invalid or duplicate key-value pair' });
    }
  };

  handleDeleteClick = (keyToDelete) => {
    const { keyValuePairs } = this.state;
    const newKeyValuePairs = { ...keyValuePairs };
    delete newKeyValuePairs[keyToDelete];
    this.setState({ keyValuePairs: newKeyValuePairs });
  };

  render() {
    const { key, value, keyValuePairs, error } = this.state;
    return (
      <div className="search-component">
        <div className="cards-container">
          {Object.entries(keyValuePairs).map(([key, value]) => (
            <div className="card" key={key}>
              <div><strong>Key:</strong> {key}</div>
              <div><strong>Value:</strong> {value}</div>
              <button className="delete-button" onClick={() => this.handleDeleteClick(key)}>
                <Icon name="close" />
              </button>
            </div>
          ))}
        </div>
        <div className="input-container">
          <Select
            className="select-input"
            name="key"
            value={this.keyOptions.find(option => option.value === key)}
            onChange={this.handleKeyChange}
            options={this.keyOptions}
            placeholder="Select a key"
            isSearchable
          />
          <input
            type="text"
            name="value"
            value={value}
            onChange={this.handleInputChange}
            placeholder="Value"
          />
          <button onClick={this.handleAddClick}>
            <Icon name="plus" />
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }
}

export default SearchComponent;
