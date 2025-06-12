import {
  ActiveFilters,
  AddFilterForm,
  ErrorDisplay,
  SearchFooter,
  SearchHeader
} from './components';
import {
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { SearchComponentHelper } from './SearchComponentHelper.js';

const SearchComponent = ({ 
  defaultSelection = {}, 
  handleSearch, 
  keys = [], 
  isLoading = false 
}) => {
  const theme = useTheme();
  const [keyValuePairs, setKeyValuePairs] = useState({ ...defaultSelection });
  const [selectedKey, setSelectedKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  // Transform keys to autocomplete options
  const keyOptions = keys.map(option => ({
    value: option,
    label: SearchComponentHelper.toTitleCase(option),
  }));

  // Initial search on component mount
  useEffect(() => {
    if (Object.keys(defaultSelection).length > 0) {
      handleSearch(defaultSelection);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddFilter = useCallback(() => {
    if (!selectedKey || !inputValue.trim()) {
      setError('Please select a filter key and enter a value');
      return;
    }

    if (keyValuePairs[selectedKey]) {
      setError(`Filter for "${SearchComponentHelper.toTitleCase(selectedKey)}" already exists`);
      return;
    }

    const newKeyValuePairs = { 
      ...keyValuePairs, 
      [selectedKey]: inputValue.trim() 
    };

    setKeyValuePairs(newKeyValuePairs);
    setSelectedKey('');
    setInputValue('');
    setError(null);
    
    handleSearch(newKeyValuePairs);
  }, [selectedKey, inputValue, keyValuePairs, handleSearch]);

  const handleRemoveFilter = useCallback((keyToRemove) => {
    const newKeyValuePairs = { ...keyValuePairs };
    delete newKeyValuePairs[keyToRemove];
    
    setKeyValuePairs(newKeyValuePairs);
    setError(null);
    
    handleSearch(newKeyValuePairs);
  }, [keyValuePairs, handleSearch]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddFilter();
    }
  };

  const handleKeyChange = useCallback((key) => {
    setSelectedKey(key);
    setError(null);
  }, []);

  const handleValueChange = useCallback((value) => {
    setInputValue(value);
    setError(null);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
      }}
    >
      {/* Search Header */}
      <SearchHeader isLoading={isLoading} />

      {/* Active Filters */}
      <ActiveFilters 
        keyValuePairs={keyValuePairs} 
        onRemoveFilter={handleRemoveFilter} 
      />

      {/* Add Filter Form */}
      <AddFilterForm
        keyOptions={keyOptions}
        selectedKey={selectedKey}
        inputValue={inputValue}
        isLoading={isLoading}
        onKeyChange={handleKeyChange}
        onValueChange={handleValueChange}
        onKeyPress={handleKeyPress}
        onAddFilter={handleAddFilter}
      />

      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* Helper Footer */}
      <SearchFooter />
    </Paper>
  );
};

export default SearchComponent;
