import {
  Box,
  Chip,
  Stack,
  Typography
} from '@mui/material';

import {
  Close
} from '@mui/icons-material';
import React from 'react';
import { SearchComponentHelper } from '../../SearchComponentHelper.js';

const ActiveFilters = ({ keyValuePairs, onRemoveFilter }) => {
  if (Object.keys(keyValuePairs).length === 0) {
    return null;
  }

  return (
    <Box mb={2}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
        Active Filters ({Object.keys(keyValuePairs).length})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {Object.entries(keyValuePairs).map(([key, value]) => (
          <Chip
            key={key}
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                  {SearchComponentHelper.toTitleCase(key)}:
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {value}
                </Typography>
              </Box>
            }
            deleteIcon={<Close sx={{ fontSize: '14px !important' }} />}
            onDelete={() => onRemoveFilter(key)}
            color="primary"
            variant="filled"
            size="small"
            sx={{
              '& .MuiChip-deleteIcon': {
                fontSize: 14,
              },
              fontWeight: 'bold',
              borderRadius: '4px',
              height: 24
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ActiveFilters; 