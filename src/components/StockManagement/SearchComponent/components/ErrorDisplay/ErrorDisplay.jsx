import {
  Alert,
  Box,
  Fade
} from '@mui/material';

import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <Fade in={!!error}>
      <Box mt={1}>
        {error && (
          <Alert severity="warning" sx={{ borderRadius: '4px', fontSize: '0.8rem' }}>
            {error}
          </Alert>
        )}
      </Box>
    </Fade>
  );
};

export default ErrorDisplay; 