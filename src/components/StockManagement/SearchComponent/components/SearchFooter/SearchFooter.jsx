import React from 'react';
import {
  Typography
} from '@mui/material';

const SearchFooter = () => {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.7rem' }}>
      Use filters to narrow down your search results. You can add multiple filters to refine your search.
    </Typography>
  );
};

export default SearchFooter; 