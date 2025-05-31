import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, TextField, IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { activateUser, sponsorPaymentHistory } from '../../middlewares/interceptors';
import { updateAmountStrictly, updateDematAmountStrictly } from '../../middlewares/interceptors';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function SponsorTradingHistory() {
  const [data, setData] = useState([]);
  const [sponsorId, setSponsorId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const storedSponsorDetails = localStorage.getItem('sponsor_details');
    if (storedSponsorDetails) {
      const sponsorData = JSON.parse(storedSponsorDetails);
      setSponsorId(sponsorData?.sponsor_id);
    }
  }, []);

  useEffect(() => {
    if (sponsorId) {
      sponsorPaymentHistory(sponsorId)
        .then((res) => {
          setData(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to fetch referrals:', err);
        });
    }
  }, [sponsorId]);

  const handleEditChange = (index, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }));
  };

  const handleSave = async (entry, index) => {
    try {
      const changes = editValues[index];
      if (changes?.amount !== undefined) {
        await updateAmountStrictly(entry.sponsor_id, { amount: Number(changes.amount) });
      }
      if (changes?.demat_amount !== undefined) {
        await updateDematAmountStrictly(entry.sponsor_id, { demat_amount: Number(changes.demat_amount) });
      }
      await activateUser(entry.sponsor_id, true);
  
      const res = await sponsorPaymentHistory(sponsorId);
      setData(res.data || []);
      setEditValues(prev => ({ ...prev, [index]: {} }));
  
      setSuccessMessage('Successfully updated sponsor details');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Failed to update amounts:', error);
    }
  };  

  return (
    <div className="p-6">
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Sponsor Name</strong></TableCell>
              <TableCell><strong>Sponsor ID</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Demat Amount</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.sponsor_name}</TableCell>
                <TableCell>{entry.sponsor_id}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={editValues[index]?.amount ?? entry.amount}
                    onChange={(e) => handleEditChange(index, 'amount', e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={editValues[index]?.demat_amount ?? entry.demat_amount}
                    onChange={(e) => handleEditChange(index, 'demat_amount', e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </TableCell>
                <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSave(entry, index)} size="small">
                    save
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" elevation={6} variant="filled">
    {successMessage}
  </MuiAlert>
</Snackbar>

    </div>
  );
}

export default SponsorTradingHistory;
