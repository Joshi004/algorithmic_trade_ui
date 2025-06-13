import {
  Box,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import {
  FilterList,
  Schedule
} from '@mui/icons-material';

import React from 'react';

const StatsDisplay = ({
  totalCount,
  lastUpdate,
  paginationMeta,
  currentPage
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* Total Count */}
      <Box display="flex" alignItems="center" gap={0.5}>
        <FilterList sx={{ fontSize: 16, color: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {totalCount.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          instruments
        </Typography>
      </Box>
      
      {/* Divider */}
      <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />
      
      {/* Last Updated */}
      <Box display="flex" alignItems="center" gap={0.5}>
        <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          Updated:
        </Typography>
        <Chip
          label={lastUpdate === 'Never' ? 'Never' : new Date(lastUpdate).toLocaleTimeString()}
          color={lastUpdate === 'Never' ? 'warning' : 'success'}
          size="small"
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'medium' }}
          onClick={() => { }}
        />
      </Box>
    </Stack>
  );
};

export default StatsDisplay; 