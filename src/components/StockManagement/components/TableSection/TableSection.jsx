import {
  Fade,
  Paper,
  alpha,
  useTheme
} from '@mui/material';

import CommonTable from '../../CommonTable';
import React from 'react';

const TableSection = ({
  data,
  columns,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  paginationMeta
}) => {
  const theme = useTheme();

  const tableProps = {
    data,
    columns,
    loading,
    totalCount,
    currentPage,
    pageSize,
    onPageChange,
    paginationMeta,
    showPagination: false // Hide pagination in CommonTable since we have custom pagination
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        <CommonTable {...tableProps} />
      </Paper>
    </Fade>
  );
};

export default TableSection; 