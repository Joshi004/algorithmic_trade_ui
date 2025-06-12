import {
  Button
} from '@mui/material';
import {
  CloudSync
} from '@mui/icons-material';
import React from 'react';

const UpdateButton = ({
  onUpdateInstruments,
  updatingInstruments
}) => {
  return (
    <Button
      variant="contained"
      startIcon={<CloudSync sx={{ fontSize: 16 }} />}
      onClick={onUpdateInstruments}
      disabled={updatingInstruments}
      size="small"
      sx={{
        textTransform: 'none',
        borderRadius: '6px',
        px: 2,
        py: 0.75,
        fontWeight: 'medium',
        fontSize: '0.8rem',
        minWidth: 'auto'
      }}
    >
      {updatingInstruments ? 'Updating...' : 'Update'}
    </Button>
  );
};

export default UpdateButton; 