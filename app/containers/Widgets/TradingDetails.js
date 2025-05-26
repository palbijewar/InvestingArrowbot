/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { getAllSponsors } from '../../middlewares/interceptors.js';

function TradingDetails() {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors();
        setSponsors(res.data);
        setFilteredSponsors(res.data);
      } catch (err) {
        console.error('Failed to fetch sponsors:', err);
      }
    };
    fetchSponsors();
  }, []);

  useEffect(() => {
    let filtered = [...sponsors];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = sponsors.filter(
        (sponsor) =>
          sponsor.username?.toLowerCase().includes(lower) ||
          sponsor.email?.toLowerCase().includes(lower) ||
          sponsor.phone?.toLowerCase().includes(lower)
      );
    }
    setFilteredSponsors(filtered);
    setCurrentPage(1);
  }, [searchTerm, sponsors]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sorted = [...filteredSponsors].sort((a, b) => {
      const aVal = a[key] || '';
      const bVal = b[key] || '';
      return direction === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

    setFilteredSponsors(sorted);
  };

  const totalPages = Math.ceil((filteredSponsors?.length || 0) / limit);
  const paginatedSponsors = filteredSponsors.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Define columns to show, optionally hide some on mobile for better fit
  const columns = [
    { key: 'sponsor_id', label: 'SPONSOR ID', showOnMobile: true },
    { key: 'username', label: 'USERNAME', showOnMobile: true },
    { key: 'email', label: 'EMAIL', showOnMobile: false },
    { key: 'phone', label: 'PHONE', showOnMobile: false },
    { key: 'package', label: 'PACKAGE', showOnMobile: false },
    { key: 'amount_deposited', label: 'AMOUNT DEPOSITED', showOnMobile: true },
    { key: 'demat_amount', label: 'DEMAT AMOUNT', showOnMobile: false },
    { key: 'gas_wallet_fees', label: 'GAS WALLET FEES', showOnMobile: true },
    { key: 'is_active', label: 'IS ACTIVE', showOnMobile: true },
  ];

  return (
    <Box p={2}>
      <TextField
        label="Search by username, email, or phone"
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Horizontal scroll wrapper */}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 500, minWidth: 650 }} // minWidth prevents squeezing on small screens
        >
          <Table stickyHeader aria-label="sponsors table" size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {columns.map(({ key, label, showOnMobile }) =>
                  (!isMobile || showOnMobile) ? (
                    <TableCell
                      key={key}
                      onClick={() => handleSort(key)}
                      sx={{ cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSponsors.map((sponsor) => (
                <TableRow key={sponsor.sponsor_id}>
                  {columns.map(({ key, showOnMobile }) =>
                    (!isMobile || showOnMobile) ? (
                      <TableCell key={key} sx={{ whiteSpace: 'nowrap' }}>
                        {key === 'is_active'
                          ? sponsor.is_active ? 'Active' : 'Deactive'
                          : sponsor[key] ?? ''}
                      </TableCell>
                    ) : null
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          size="small"
        >
          Prev
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default TradingDetails;
