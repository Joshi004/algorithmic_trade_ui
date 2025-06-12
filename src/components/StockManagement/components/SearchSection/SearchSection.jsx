import {
  Grow,
  Paper,
  alpha,
  useTheme
} from '@mui/material';

import React from 'react';
import SearchComponent from '../../SearchComponent';

const SearchSection = ({
  defaultSelection,
  handleSearch,
  keys,
  isLoading
}) => {
  const theme = useTheme();

  const searchProps = {
    defaultSelection,
    handleSearch,
    keys,
    isLoading
  };

  return (
    <Grow in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          borderRadius: '8px',
          mb: 1.5,
          overflow: 'visible',
          flexShrink: 0
        }}
      >
        <SearchComponent {...searchProps} />
      </Paper>
    </Grow>
  );
};

export default SearchSection; 