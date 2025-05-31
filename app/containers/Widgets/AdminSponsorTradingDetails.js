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
  CircularProgress,
} from '@mui/material';
import { activateUser, getAllSponsors, getSponsorDetailsById, updateActivationDate, updateAmountStrictly, updateDematAmountStrictly, updateGasWalletAmountStrictly, updatePackage } from '../../middlewares/interceptors.js';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function SponsorTradingHistory() {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSponsorDetails, setSelectedSponsorDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [gasWalletDialogOpen, setGasWalletDialogOpen] = useState(false);

  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
const [editValues, setEditValues] = useState({});
  const limit = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const storedSponsorDetails = localStorage.getItem('sponsor_details');
        const sponsorData = JSON.parse(storedSponsorDetails);
        if(sponsorData.user_type=="superadmin"){
          const res = await getAllSponsors();
          setSponsors(res.data);
          setFilteredSponsors(res.data);
        }else{
          const res = await getSponsorDetailsById(sponsorData?.sponsor_id);
          setSponsors(res.data);
          setFilteredSponsors(res.data);
        }
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

function convertToFullISO(dateStr, timeStr = '14:33:08.935', offset = '+00:00') {
  const [day, month, year] = dateStr.split('/');
  const fullYear = 2000 + parseInt(year, 10);

  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');

  return `${fullYear}-${formattedMonth}-${formattedDay}T${timeStr}${offset}`;
}

  const handleEditChange = (key, value) => {
    setEditValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleSave = async (sponsorId) => {
    try {
      const cleanedEditValues = Object.fromEntries(
  Object.entries(editValues).filter(
    ([, value]) => value != null && value !== ''
  )
);

       if ('is_active' in cleanedEditValues) {
        await activateUser(sponsorId, { is_active: cleanedEditValues.is_active });
      }
      if ('package' in cleanedEditValues) {
        await updatePackage(sponsorId, { package: cleanedEditValues.package });
      }
      if ('activation_date' in cleanedEditValues) {
        const inputDate = cleanedEditValues.activation_date;
const isoDate = convertToFullISO(inputDate);

        await updateActivationDate(sponsorId, { activation_date: isoDate });
      }
      if ('demat_amount' in cleanedEditValues) {
        await updateDematAmountStrictly(sponsorId, { demat_amount: +cleanedEditValues.demat_amount });
      }
      if ('amount_deposited' in cleanedEditValues) {
        await updateAmountStrictly(sponsorId, { amount_deposited: +cleanedEditValues.amount_deposited });
      }
      if ('gas_wallet_fees' in cleanedEditValues) {
        await updateGasWalletAmountStrictly(sponsorId, { gas_wallet_fees: +cleanedEditValues.gas_wallet_fees });
      }
  setSuccessSnackbarOpen(true);

      setEditingSponsorId(null);
      setEditValues({});
      const updated = await getAllSponsors();
      setSponsors(updated.data);
      setFilteredSponsors(updated.data);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };  

  const columns = [
    { key: 'sponsor_id', label: 'SPONSOR ID', showOnMobile: true },
    { key: 'username', label: 'USERNAME', showOnMobile: true },
    { key: 'email', label: 'EMAIL', showOnMobile: false },
    { key: 'phone', label: 'PHONE', showOnMobile: false },
    { key: 'activation_date', label: 'ACTIVATION DATE', showOnMobile: false },
    { key: 'package', label: 'PACKAGE', showOnMobile: false },
    { key: 'amount_deposited', label: 'AMOUNT DEPOSITED', showOnMobile: true },
    { key: 'demat_amount', label: 'DEMAT AMOUNT', showOnMobile: false },
    { key: 'gas_wallet_fees', label: 'GAS WALLET FEES', showOnMobile: true },
    { key: 'is_active', label: 'IS ACTIVE', showOnMobile: true },
    { key: 'actions', label: 'ACTIONS', showOnMobile: true },
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

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 500, minWidth: 650 }}
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
  {paginatedSponsors.map((sponsor) => {
    const isEditing = editingSponsorId === sponsor.sponsor_id;

    return (
      <TableRow
        key={sponsor.sponsor_id}
        hover
        sx={{ cursor: 'pointer' }}
      >
        {columns.map(({ key, showOnMobile }) =>
          (!isMobile || showOnMobile) ? (
            <TableCell key={key}>
              {isEditing && ['package', 'activation_date', 'amount_deposited', 'demat_amount', 'gas_wallet_fees'].includes(key) ? (
                <TextField
                  size="small"
                  variant="standard"
                  value={editValues[key] ?? sponsor[key] ?? ''}
                  onChange={(e) => handleEditChange(key, e.target.value)}
                />
              ) : key === 'is_active' && isEditing ? (
                <select
                  value={editValues[key] ?? sponsor.is_active}
                  onChange={(e) => handleEditChange(key, e.target.value === 'true')}
                >
                  <option value="true">Active</option>
                  <option value="false">Deactive</option>
                </select>
              ) : key === 'actions' ? (
                isEditing ? (
                  <>
                    <Button size="small" color="primary" onClick={() => handleSave(sponsor.sponsor_id)}>
                      Save
                    </Button>
                    <Button size="small" onClick={() => setEditingSponsorId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setEditingSponsorId(sponsor.sponsor_id);
                      setEditValues(sponsor);
                    }}
                  >
                    Edit
                  </Button>
                )
              ) : key === 'is_active' ? (
                sponsor.is_active ? 'Active' : 'Deactive'
              ) : (
                ['package','amount_deposited','demat_amount','gas_wallet_fees'].includes(key)
                  ? sponsor[key] != null ? `$ ${sponsor[key]}` : ''
                  : sponsor[key] ?? ''
              )}
            </TableCell>
          ) : null
        )}
      </TableRow>
    );
  })}
</TableBody>

          </Table>
        </TableContainer>
        <Snackbar
  open={successSnackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSuccessSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <MuiAlert onClose={() => setSuccessSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
    Sponsor details saved successfully!
  </MuiAlert>
</Snackbar>
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

      {/* Sponsor Details Section */}
      {selectedSponsorDetails && (
        <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
          <Typography variant="h6">Sponsor Details</Typography>
          {loadingDetails ? (
            <Box display="flex" alignItems="center" mt={2}>
              <CircularProgress size={24} />
              <Typography ml={2}>Loading...</Typography>
            </Box>
          ) : (
            Object.entries(selectedSponsorDetails).map(([key, value]) => (
              <Typography key={key} sx={{ wordBreak: 'break-word' }}>
                <strong>{key}:</strong> {String(value)}
              </Typography>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

export default SponsorTradingHistory;
