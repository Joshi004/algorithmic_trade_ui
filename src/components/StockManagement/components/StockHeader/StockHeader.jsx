import {
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { StatsDisplay, UpdateButton } from './components';

import React from 'react';

const StockHeader = ({
  totalCount,
  lastUpdate,
  updatingInstruments,
  paginationMeta,
  currentPage,
  onUpdateInstruments
}) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={2}
      p={1.5}
      sx={{
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        flexShrink: 0
      }}
    >
      {/* Left - Title and Quick Stats */}
      <Box display="flex" alignItems="center" gap={3}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Stock Management
        </Typography>
        
        <StatsDisplay
          totalCount={totalCount}
          lastUpdate={lastUpdate}
          paginationMeta={paginationMeta}
          currentPage={currentPage}
        />
      </Box>

      {/* Right - Update Button */}
      <UpdateButton
        onUpdateInstruments={onUpdateInstruments}
        updatingInstruments={updatingInstruments}
      />
    </Box>
  );
};

export default StockHeader; 