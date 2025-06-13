import {
  Box,
  CircularProgress,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

import {
  FilterList
} from '@mui/icons-material';
import React from 'react';

const SearchHeader = ({ isLoading }) => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            p: 0.5,
            borderRadius: '4px',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main'
          }}
        >
          <FilterList sx={{ fontSize: 18 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          Instrument Filters
        </Typography>
      </Box>
      {isLoading && (
        <CircularProgress size={16} />
      )}
    </Box>
  );
};

export default SearchHeader; 