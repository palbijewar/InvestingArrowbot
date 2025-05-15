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
  CircularProgress,
  Dialog
} from '@mui/material';
import {
  getAllSponsors,
  activateUser,
  getSponsorPdf,
  updateAmount,
} from '../../middlewares/interceptors.js';

function AdminTable() {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editAmount, setEditAmount] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const limit = 10;

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
        (sponsor) => sponsor.username?.toLowerCase().includes(lower)
          || sponsor.email?.toLowerCase().includes(lower) || sponsor.phone?.toLowerCase().includes(lower)
      );
    }
    setFilteredSponsors(filtered);
    setCurrentPage(1);
  }, [searchTerm, sponsors]);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
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

  const handleViewScreenshot = async (sponsorId) => {
    try {
      const blob = await getSponsorPdf(sponsorId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      if (error.response?.status === 404) {
        setDialogMessage('No payment screenshot found for this sponsor.');
        setOpenDialog(true);
      } else {
        console.error('Failed to load payment screenshot:', error);
      }
    }
  };

  const handleAmountUpdate = async (sponsorId) => {
    let amountStr = editAmount[sponsorId];

    // fallback to original sponsor amount if not manually edited
    // eslint-disable-next-line no-prototype-builtins
    if (!editAmount.hasOwnProperty(sponsorId) || amountStr === '' || amountStr === null || amountStr === undefined) {
      amountStr = sponsors.find(s => s.sponsor_id === sponsorId)?.amount_deposited;
    }

    // make sure to convert it to string before parsing
    const amount = parseFloat(amountStr?.toString());

    try {
      await updateAmount(sponsorId, { amount_deposited: amount });

      setSponsors(prev => prev.map(sponsor => (sponsor.sponsor_id === sponsorId
        ? { ...sponsor, amount_deposited: amount }
        : sponsor)
      )
      );
    } catch (error) {
      console.error('Failed to update amount:', error);
    }
  };

  const handleToggle = async (sponsorId, currentStatus) => {
    const sponsor = sponsors.find((s) => s.sponsor_id === sponsorId);
    const raw = editAmount[sponsorId] ?? sponsor.amount_deposited;
    const amount = parseFloat(raw);

    if (!currentStatus) {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(amount) || amount <= 0) {
        setOpenDialog(true);
        return;
      }
    }

    setLoadingId(sponsorId);
    try {
      await handleAmountUpdate(sponsorId);

      await activateUser(sponsorId, !currentStatus);

      setSponsors((prev) => prev.map((s) => {
        if (s.sponsor_id !== sponsorId) return s;
        return {
          ...s,
          is_active: !currentStatus,
          ...(!currentStatus
            ? { amount_deposited: amount.toString() }
            : {}
          ),
        };
      })
      );

      setDialogMessage(currentStatus
        ? 'Sponsor deactivated successfully.'
        : 'Sponsor activated successfully!');
      setOpenDialog(true);
    } catch (err) {
      console.error('Activation failed', err);
      setDialogMessage('Failed to activate/deactivate sponsor.');
      setOpenDialog(true);
    } finally {
      setLoadingId(null);
    }
  };

  const totalPages = Math.ceil(filteredSponsors.length / limit);
  const paginatedSponsors = filteredSponsors.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

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

      <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['sponsor_id', 'username', 'email', 'phone', 'package', 'amount_deposited'].map((key) => (
                <TableCell
                  key={key}
                  onClick={() => handleSort(key)}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {key.replace('_', ' ').toUpperCase()}
                </TableCell>
              ))}
              <TableCell>Document</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSponsors.map((sponsor) => (
              <TableRow key={sponsor.sponsor_id}>
                <TableCell>{sponsor.sponsor_id}</TableCell>
                <TableCell>{sponsor.username}</TableCell>
                <TableCell>{sponsor.email}</TableCell>
                <TableCell>{sponsor.phone}</TableCell>
                <TableCell>{sponsor.package || 'N/A'}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    variant="outlined"
                    value={
                      // eslint-disable-next-line no-prototype-builtins
                      editAmount.hasOwnProperty(sponsor.sponsor_id)
                        ? editAmount[sponsor.sponsor_id]
                        : (sponsor.amount_deposited ?? '')
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*\.?\d*$/.test(v)) {
                        setEditAmount((p) => ({ ...p, [sponsor.sponsor_id]: v }));
                      }
                    }}

                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewScreenshot(sponsor.sponsor_id)}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color={sponsor.is_active ? 'error' : 'success'}
                    onClick={() => handleToggle(sponsor.sponsor_id, sponsor.is_active)}
                    disabled={loadingId === sponsor.sponsor_id}
                    startIcon={loadingId === sponsor.sponsor_id ? <CircularProgress size={14} /> : null}
                  >
                    {sponsor.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Typography>Page {currentPage} of {totalPages}</Typography>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Box p={3}>
          <Typography variant="body1">{dialogMessage}</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpenDialog(false)} variant="contained">OK</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AdminTable;
