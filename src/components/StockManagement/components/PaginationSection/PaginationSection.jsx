import {
  Box,
  Paper,
  TablePagination,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

import React from 'react';

const PaginationSection = ({
  totalCount,
  currentPage,
  pageSize,
  paginationMeta,
  onPageChange
}) => {
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage, pageSize);
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageChange(0, newPageSize); // Reset to first page with new page size
  };

  const paginationProps = {
    component: "div",
    count: totalCount,
    page: currentPage,
    onPageChange: handleChangePage,
    rowsPerPage: pageSize,
    onRowsPerPageChange: handleChangeRowsPerPage,
    rowsPerPageOptions: [10, 25, 50, 100],
    labelRowsPerPage: "Rows:",
    showFirstButton: true,
    showLastButton: true
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(10px)',
        flexShrink: 0
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {paginationMeta.num_pages && (
            `Page ${currentPage + 1} of ${paginationMeta.num_pages} • `
          )}
          Showing {Math.min(pageSize, totalCount)} of {totalCount.toLocaleString()} instruments
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TablePagination {...paginationProps} />
        </Box>
      </Box>
    </Paper>
  );
};

export default PaginationSection; 