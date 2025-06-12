import {
  Box,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import {
  FilterList,
  Remove,
  TrendingDown,
  TrendingUp
} from '@mui/icons-material';

import React from 'react';

const CommonTable = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  totalCount = 0,
  currentPage = 0,
  pageSize = 50,
  onPageChange,
  paginationMeta = {},
  showPagination = true
}) => {
  const theme = useTheme();

  // Helper function to convert snake_case to Title Case
  const toTitleCase = (str) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to format cell values
  const formatCellValue = (value, columnName) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          N/A
        </Typography>
      );
    }

    // Price formatting
    if (columnName.includes('price') && typeof value === 'number') {
      return (
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: value > 0 ? 'success.main' : value < 0 ? 'error.main' : 'text.primary'
            }}
          >
            ₹{value.toFixed(2)}
          </Typography>
          {value > 0 && <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />}
          {value < 0 && <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />}
          {value === 0 && <Remove sx={{ fontSize: 16, color: 'text.disabled' }} />}
        </Box>
      );
    }

    // Instrument type styling
    if (columnName === 'instrument_type') {
      const colorMap = {
        'EQ': 'success',
        'FUT': 'primary',
        'OPT': 'secondary',
        'CE': 'info',
        'PE': 'warning'
      };
      return (
        <Chip
          label={value}
          size="small"
          color={colorMap[value] || 'default'}
          variant="filled"
          sx={{ fontWeight: 'bold', minWidth: 60 }}
        />
      );
    }

    // Exchange styling
    if (columnName === 'exchange') {
      const exchangeColors = {
        'NSE': 'primary',
        'BSE': 'secondary',
        'MCX': 'warning',
        'NCDEX': 'info'
      };
      return (
        <Chip
          label={value.toUpperCase()}
          size="small"
          color={exchangeColors[value.toUpperCase()] || 'default'}
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      );
    }

    // Date formatting
    if (columnName.includes('expiry') && value !== '1970-01-01') {
      const date = new Date(value);
      if (!isNaN(date)) {
        return (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {date.toLocaleDateString()}
          </Typography>
        );
      }
    }

    // Numeric formatting
    if (typeof value === 'number') {
      return (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
          {value.toLocaleString()}
        </Typography>
      );
    }

    // Default string value
    return (
      <Typography variant="body2">
        {String(value)}
      </Typography>
    );
  };

  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage, pageSize);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    if (onPageChange) {
      onPageChange(0, newPageSize); // Reset to first page with new page size
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={400}
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading instruments...
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={400}
        gap={2}
        sx={{ color: 'text.secondary' }}
      >
        <FilterList sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography variant="h6">No data available</Typography>
        <Typography variant="body2">
          Try adjusting your search filters to see results
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Table Header with Count and Pagination Info */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        gap={2}
        p={2.5}
        borderBottom={`1px solid ${alpha(theme.palette.divider, 0.12)}`}
        sx={{ flexShrink: 0 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Instruments ({totalCount.toLocaleString()})
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          {paginationMeta.num_pages && showPagination && (
            <Typography variant="body2" color="text.secondary">
              Page {currentPage + 1} of {paginationMeta.num_pages}
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Table */}
      <TableContainer sx={{ 
        flex: 1, 
        overflowX: 'auto',
        height: showPagination ? 'auto' : '100%'
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: theme.palette.background.paper,
                    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(10px)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: alpha(theme.palette.background.paper, 0.95),
                      zIndex: -1,
                    }
                  }}
                >
                  {toTitleCase(column)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.instrument_token || index}
                hover
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                  '&:nth-of-type(even)': {
                    bgcolor: alpha(theme.palette.background.default, 0.3),
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${row.instrument_token || index}-${column}`}
                    sx={{
                      py: 1.5,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                  >
                    {formatCellValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Server-side Pagination - Conditionally rendered */}
      {showPagination && (
        <Box
          borderTop={`1px solid ${alpha(theme.palette.divider, 0.12)}`}
          bgcolor={alpha(theme.palette.background.paper, 0.5)}
          sx={{ flexShrink: 0 }}
        >
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Rows:"
          />
        </Box>
      )}
    </Box>
  );
};

export default CommonTable; 