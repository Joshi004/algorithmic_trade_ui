import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const LoadingBackdrop = ({ 
  open, 
  title, 
  subtitle, 
  size = 60,
  zIndex 
}) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: zIndex || ((theme) => theme.zIndex.drawer + 1),
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={size} />
      {title && (
        <Typography variant="h6" color="inherit">
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
          {subtitle}
        </Typography>
      )}
    </Backdrop>
  );
};

export default LoadingBackdrop; 