import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
}));

const TradeManagementHeader = () => {
  return (
    <HeaderBox>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
          Trade Sessions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage your algorithmic trading sessions
        </Typography>
      </Box>
    </HeaderBox>
  );
};

export default TradeManagementHeader; 