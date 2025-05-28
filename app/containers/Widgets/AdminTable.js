/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem
} from '@mui/material';
import {
  getAllSponsors,
  activateUser,
  getSponsorPdf,
  updateAmount,
  updatePackage,
  deleteSponsor,
  updateDematAmount,
  updateGasWalletAmount
} from '../../middlewares/interceptors.js';

function AdminTable() {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editAmount, setEditAmount] = useState({});
  const [editDematAmount, setEditDematAmount] = useState({});
  const [editPackage, setEditPackage] = useState({});
  const [editGasWalletFees, setEditGasWalletFees] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [dialogMessage, setDialogMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors(false);

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
          || sponsor.email?.toLowerCase().includes(lower)
          || sponsor.phone?.toLowerCase().includes(lower)
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
      const { data } = await getSponsorPdf(sponsorId);
      if (!data) {
        setDialogMessage('No PDF file path returned for this sponsor.');
        setOpenDialog(true);
        return;
      }
      const link = document.createElement('a');
      link.href = data;
      link.target = '_blank';
      link.download = `screenshot_${sponsorId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    // eslint-disable-next-line no-prototype-builtins
    if (!editAmount.hasOwnProperty(sponsorId) || amountStr === '' || amountStr == null) {
      amountStr = sponsors.find((s) => s.sponsor_id === sponsorId)?.amount_deposited;
    }
    const amount = parseFloat(amountStr?.toString());

    await updateAmount(sponsorId, { amount }, true);

    setSponsors((prev) => prev.map((s) => (s.sponsor_id === sponsorId ? { ...s, amount_deposited: amount } : s)
    )
    );
  };

  const handleDematAmountUpdate = async (sponsorId) => {
    let amountStr = editDematAmount[sponsorId];
    // eslint-disable-next-line no-prototype-builtins
    if (!editDematAmount.hasOwnProperty(sponsorId) || amountStr === '' || amountStr == null) {
      amountStr = sponsors.find((s) => s.sponsor_id === sponsorId)?.demat_amount;
    }
    const dematAmount = parseFloat(amountStr?.toString());
    updateDematAmount(sponsorId, { demat_amount: parseFloat(dematAmount) }, true);
    setSponsors((prev) => prev.map((s) => (s.sponsor_id === sponsorId ? { ...s, demat_amount: dematAmount } : s)
    )
    );
  };

  const handleGasWalletAmountUpdate = async (sponsorId) => {
    const amountStr = editGasWalletFees[sponsorId];
  
    // Return early if no value is provided
    if (
      !editGasWalletFees.hasOwnProperty(sponsorId) ||
      amountStr === '' ||
      amountStr == null ||
      isNaN(parseFloat(amountStr))
    ) {
      return; // 🔁 Do not perform update
    }
  
    const gasWalletAmount = parseFloat(amountStr.toString());
    const storedSponsorDetails = localStorage.getItem('sponsor_details');
    const sponsorData = JSON.parse(storedSponsorDetails);
  
    try {
      await updateGasWalletAmount(sponsorId, {
        gas_wallet_amount: gasWalletAmount,
        is_active: true,
        payment_sponsor_id: sponsorData?.sponsor_id,
      });
  
      setSponsors((prev) =>
        prev.map((s) =>
          s.sponsor_id === sponsorId
            ? { ...s, gas_wallet_amount: gasWalletAmount }
            : s
        )
      );
    } catch (err) {
      console.error('Failed to update gas wallet amount:', err);
    }
  };
  

  const handleToggle = async (sponsorId, currentStatus) => {
    const sponsor = sponsors.find((s) => s.sponsor_id === sponsorId);
    const raw = editAmount[sponsorId] ?? sponsor.amount_deposited;
    const amount = parseFloat(raw);
  
    setLoadingId(sponsorId);
    try {
      await handleAmountUpdate(sponsorId);
      await handleDematAmountUpdate(sponsorId);
      await handleGasWalletAmountUpdate(sponsorId);
      await activateUser(sponsorId, !currentStatus);
  
      setSponsors((prev) =>
        prev.map((s) =>
          s.sponsor_id === sponsorId ? { ...s, is_active: !currentStatus } : s
        )
      );
  
      setDialogMessage(currentStatus ? 'Sponsor deactivated.' : 'Sponsor activated.');
      setOpenDialog(true);
    } catch (err) {
      console.error('Activation failed', err);
      setDialogMessage('Failed to activate/deactivate sponsor.');
      setOpenDialog(true);
    } finally {
      setLoadingId(null);
    }
  };
  

  const handleDelete = async (sponsorId) => {
    try {
      await deleteSponsor(sponsorId);
      setSponsors((prev) => prev.filter((s) => s.sponsor_id !== sponsorId));
      setDialogMessage('Sponsor deleted.');
      setOpenDialog(true);
    } catch (err) {
      console.error('Delete failed', err);
      setDialogMessage('Failed to delete sponsor.');
      setOpenDialog(true);
    }
  };

  const handleEditClick = (event, sponsor) => {
    setAnchorEl(event.currentTarget);
    setSelectedSponsor(sponsor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSponsor(null);
  };

  const handleActionClick = async (action) => {
    if (!selectedSponsor) return;
    if (action === 'toggle') {
      await handleToggle(selectedSponsor.sponsor_id, selectedSponsor.is_active);
    } else if (action === 'delete') {
      if (confirm) await handleDelete(selectedSponsor.sponsor_id);
    }
    handleMenuClose();
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

      <TableContainer component={Paper} sx={{ maxHeight: 500, whiteSpace: 'nowrap' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow >
              {['sponsor_id', 'username', 'email', 'phone', 'package', 'amount_deposited','demat_amount','gas_wallet'].map((key) => (
                <TableCell
                  key={key}
                  onClick={() => handleSort(key)}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {key.replace('_', ' ').toUpperCase()}
                </TableCell>
              ))}
              <TableCell>DOCUMENT</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSponsors.map((sponsor) => (
              <TableRow key={sponsor.sponsor_id}>
                <TableCell>{sponsor.sponsor_id}</TableCell>
                <TableCell>{sponsor.username}</TableCell>
                <TableCell>{sponsor.email}</TableCell>
                <TableCell>{sponsor.phone}</TableCell>
                <TableCell>
                  <select
                    value={
                      // eslint-disable-next-line no-prototype-builtins
                      editPackage.hasOwnProperty(sponsor.sponsor_id)
                        ? editPackage[sponsor.sponsor_id]
                        : sponsor.package ?? ''
                    }
                    onChange={async (e) => {
                      const pkg = e.target.value;
                      setEditPackage((prev) => ({ ...prev, [sponsor.sponsor_id]: pkg }));
                      try {
                        await updatePackage(sponsor.sponsor_id, { package: pkg }, true);
                        setSponsors((prev) => prev.map((s) => (s.sponsor_id === sponsor.sponsor_id ? { ...s, package: pkg } : s)
                        )
                        );
                      } catch (error) {
                        console.error('Failed to update package:', error);
                        setDialogMessage('Failed to update package.');
                        setOpenDialog(true);
                      }
                    }}
                    style={{ padding: '6px', borderRadius: '4px' }}
                  >
                    <option value="">Select</option>
                    {[30, 75, 125, 220, 650].map((val) => (
                      <option key={val} value={val}>${val}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    variant="outlined"
                    value={
                      // eslint-disable-next-line no-prototype-builtins
                      editAmount.hasOwnProperty(sponsor.sponsor_id)
                        ? editAmount[sponsor.sponsor_id]
                        : sponsor.amount_deposited ?? ''
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
  <TextField
    type="number"
    size="small"
    variant="outlined"
    value={
      // eslint-disable-next-line no-prototype-builtins
      editDematAmount.hasOwnProperty(sponsor.sponsor_id)
        ? editDematAmount[sponsor.sponsor_id]
        : sponsor.demat_amount ?? ''
    }
    onChange={(e) => setEditDematAmount((prev) => ({
        ...prev,
        [sponsor.sponsor_id]: e.target.value,
      }))
    }
  />
</TableCell>
<TableCell>
  <TextField
    value={
      editGasWalletFees.hasOwnProperty(sponsor.sponsor_id)
        ? editGasWalletFees[sponsor.sponsor_id]
        : sponsor.gas_wallet_amount ?? ''
    }
    onChange={(e) =>
      setEditGasWalletFees((prev) => ({
        ...prev,
        [sponsor.sponsor_id]: e.target.value,
      }))
    }
    onBlur={() => handleGasWalletAmountUpdate(sponsor.sponsor_id)}
    size="small"
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
                    onClick={(e) => handleEditClick(e, sponsor)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
        <DialogTitle>Info</DialogTitle>
        <DialogContent>{dialogMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleActionClick('toggle')}>
          {selectedSponsor?.is_active ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('delete')}>Delete</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cancel</MenuItem>
      </Menu>
    </Box>
  );
}

export default AdminTable;