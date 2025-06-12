import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

import {
  Add
} from '@mui/icons-material';
import React from 'react';

const AddFilterForm = ({
  keyOptions,
  selectedKey,
  inputValue,
  isLoading,
  onKeyChange,
  onValueChange,
  onKeyPress,
  onAddFilter
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '6px',
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.85rem' }}>
        Add New Filter
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={1} 
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      >
        <Autocomplete
          options={keyOptions}
          getOptionLabel={(option) => option.label}
          value={keyOptions.find(option => option.value === selectedKey) || null}
          onChange={(event, newValue) => {
            onKeyChange(newValue?.value || '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Key"
              placeholder="Select a filter..."
              variant="outlined"
              size="small"
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Typography variant="body2">
                {option.label}
              </Typography>
            </Box>
          )}
          sx={{ minWidth: { xs: '100%', sm: 160 }, flex: 1 }}
          disabled={isLoading}
        />

        <TextField
          label="Filter Value"
          placeholder="Enter value..."
          value={inputValue}
          onChange={(e) => {
            onValueChange(e.target.value);
          }}
          onKeyPress={onKeyPress}
          variant="outlined"
          size="small"
          sx={{ minWidth: { xs: '100%', sm: 160 }, flex: 1 }}
          disabled={isLoading}
        />

        <IconButton
          onClick={onAddFilter}
          disabled={!selectedKey || !inputValue.trim() || isLoading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            alignSelf: { xs: 'center', sm: 'flex-start' },
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              bgcolor: 'action.disabled',
              color: 'action.disabled',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <Add sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Stack>
    </Box>
  );
};

export default AddFilterForm; 