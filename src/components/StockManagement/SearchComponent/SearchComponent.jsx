import React from "react";
import Select from "react-select";
import { Icon } from "semantic-ui-react";
import "./SearchComponent.scss";
import { SearchComponentHelper } from "./SearchComponentHelper.js";
import Loader from "../../Common/Loader/Loader"
class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyValuePairs: { ...this.props.defaultSelection }, // Object to store key-value pairs
      key: this.props.defaultKey || "", // Current key input by user
      value: "", // Current value input by user
      error: null, // Error message
      duplicateKey: null, // Key that is a duplicate
    };
    this.keyOptions = this.props.keys.map((option) => ({
      value: option,
      label: SearchComponentHelper.toTitleCase(option),
    }));
  }

  componentDidMount() {
    this.props.handleSearch(this.state.keyValuePairs);
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
    if (key && value) {
      // If both key and value are provided by user...
      if (!keyValuePairs[key]) {
        // If key is not already in keyValuePairs...
        let newKeyValuePair = { ...keyValuePairs, [key]: value };
        this.setState(
          {
            // Add new key-value pair to keyValuePairs and reset key, value, error, and duplicateKey in state
            keyValuePairs: newKeyValuePair,
            key: "",
            value: "",
            error: null,
            duplicateKey: null,
          },
          (newKeyValuePair) => {
            this.props.handleSearch(newKeyValuePair);
          }
        );
      } else {
        // If key is already in keyValuePairs...
        this.setState({
          error: "Invalid or duplicate key-value pair",
          duplicateKey: key,
        }); // Set error message and duplicateKey in state
      }
    }
  };

  handleDeleteClick = (keyToDelete) => {
    const { keyValuePairs } = this.state;
    const newKeyValuePairs = { ...keyValuePairs }; // Copy keyValuePairs from state
    delete newKeyValuePairs[keyToDelete]; // Delete the key-value pair with the given key from the copy of keyValuePairs
    this.setState(
      { keyValuePairs: newKeyValuePairs, key: keyToDelete },
      (newKeyValuePairs) => {
        this.props.handleSearch(newKeyValuePairs);
      }
    ); // Update keyValuePairs in state with the modified copy of keyValuePairs
  };

  render() {
    const { key, value, keyValuePairs, error, duplicateKey } = this.state; // Destructure state for easier access to properties
    return (
      <div className="search-component">
        <div className="header-container">
          {/* Display the header prop */}
          <h2>{this.props.header}</h2>
          <div className="cards-container">
            {Object.entries(keyValuePairs).map(([key, value]) => (
              <div
                className={`card ${duplicateKey === key ? "highlight" : ""}`}
                key={key}
              >
                <div>
                  <strong>{key}:</strong> {value}
                </div>
                <button
                  className="delete-button"
                  onClick={() => this.handleDeleteClick(key)}
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="input-container">
          <Select
            className="select-input"
            name="key"
            value={this.keyOptions.find((option) => option.value === key)}
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
          <div className="buttonDiv">
          {this.props.isLoading ? (
            <Loader /> // Display the loader if isLoading prop is true
          ) : (
            <button onClick={this.handleAddClick}>
              <Icon name="plus" />
            </button>
          )}
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }
}
export default SearchComponent;
