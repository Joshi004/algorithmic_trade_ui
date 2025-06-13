// StockManagement.js

import {
  Box,
  Container
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import ENDPOINTS from '../../services/endpoints';
import LoadingBackdrop from '../Common/LoadingBackdrop/LoadingBackdrop';
import PaginationSection from './components/PaginationSection';
import SearchSection from './components/SearchSection';
import StockHeader from './components/StockHeader';
import TableSection from './components/TableSection';
import apiService from '../../services/apiService';
import toastService from '../../services/toastService';

const StockManagement = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [paginationMeta, setPaginationMeta] = useState({});
  const [lastUpdate, setLastUpdate] = useState(localStorage.getItem('lastUpdate') || 'Never');
  const [fetchingInstruments, setFetchingInstruments] = useState(false);
  const [updatingInstruments, setUpdatingInstruments] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    exchange: "nse",
    instrument_type: "eq",
  });

  const instrumentKeys = [
    'instrument_token',
    'exchange_token',
    'trading_symbol',
    'name',
    'last_price',
    'expiry',
    'strike',
    'tick_size',
    'lot_size',
    'instrument_type',
    'segment',
    'exchange'
  ];

  const getSearchString = useCallback((parametersObject) => {
    return Object.keys(parametersObject)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parametersObject[key]))
      .join('&');
  }, []);

  const handleSearch = useCallback(async (keyValuePair, page = 1, pageLength = pageSize) => {
    setFetchingInstruments(true);
    setCurrentFilters(keyValuePair);
    setCurrentPage(page);
    setPageSize(pageLength);
    
    try {
      // Add pagination parameters to the search
      const searchParams = {
        ...keyValuePair,
        page_no: page,
        page_length: pageLength,
        order_by: 'name',
        sort_type: 'desc'
      };
      
      const searchString = getSearchString(searchParams);
      const url = `${ENDPOINTS.INSTRUMENTS.GET_ALL}?${searchString}`;
      const res_data = await apiService.get(url);
      
      const responseData = res_data.data;
      const responseColumns = responseData.length > 0 ? Object.keys(responseData[0]) : [];
      
      setData(responseData);
      setColumns(responseColumns);
      
      // Fix: Use the correct field name from the API response
      const meta = res_data.meta || {};
      setPaginationMeta(meta);
      setTotalCount(meta.count || 0);
      
    } catch (error) {
      console.error('Error fetching instruments:', error);
      toastService.error('Failed to fetch instruments. Please try again.', 'Search Failed');
    } finally {
      setFetchingInstruments(false);
    }
  }, [getSearchString, pageSize]);

  const handlePageChange = useCallback((newPage, newPageSize) => {
    handleSearch(currentFilters, newPage + 1, newPageSize); // API uses 1-based pagination
  }, [handleSearch, currentFilters]);

  const updateInstruments = useCallback(async () => {
    setUpdatingInstruments(true);
    try {
      await apiService.get(ENDPOINTS.INSTRUMENTS.UPDATE);
      
      const now = new Date();
      const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      localStorage.setItem('lastUpdate', timestamp);
      setLastUpdate(timestamp);
      
      toastService.success('Instruments updated successfully! Refreshing data...', 'Update Complete');
      
      // Auto-fetch instruments after successful update
      setTimeout(() => {
        handleSearch(currentFilters, 1, pageSize);
      }, 1000);
      
    } catch (error) {
      console.error('Error updating instruments:', error);
      toastService.error('Failed to update instruments. Please try again.', 'Update Failed');
    } finally {
      setUpdatingInstruments(false);
    }
  }, [handleSearch, currentFilters, pageSize]);

  return (
    <Box 
      sx={{ 
        height: '95vh', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 1.5, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Stock Header Section */}
        <StockHeader
          totalCount={totalCount}
          lastUpdate={lastUpdate}
          updatingInstruments={updatingInstruments}
          paginationMeta={paginationMeta}
          currentPage={currentPage}
          onUpdateInstruments={updateInstruments}
        />

        {/* Search Section */}
        <SearchSection
          defaultSelection={currentFilters}
          handleSearch={(filters) => handleSearch(filters, 1, pageSize)}
          keys={instrumentKeys}
          isLoading={fetchingInstruments}
        />

        {/* Table Section - Scrollable */}
        <TableSection
          data={data}
          columns={columns}
          loading={fetchingInstruments}
          totalCount={totalCount}
          currentPage={currentPage - 1} // Convert to 0-based for MUI TablePagination
          pageSize={pageSize}
          onPageChange={handlePageChange}
          paginationMeta={paginationMeta}
        />

        {/* Fixed Pagination at Bottom */}
        <PaginationSection
          totalCount={totalCount}
          currentPage={currentPage - 1} // Convert to 0-based for MUI TablePagination
          pageSize={pageSize}
          paginationMeta={paginationMeta}
          onPageChange={handlePageChange}
        />

        {/* Loading Overlay for both updating and fetching */}
        <LoadingBackdrop
          open={updatingInstruments || fetchingInstruments}
          title={updatingInstruments ? "Updating Instruments" : "Loading Instruments"}
          subtitle={updatingInstruments ? "This may take a few moments..." : "Fetching data..."}
        />
      </Container>
    </Box>
  );
};

export default StockManagement;
