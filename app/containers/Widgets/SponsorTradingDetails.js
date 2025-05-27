/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  getAllSponsors,
  updateProfit,
  updateDematAmount,
} from '../../middlewares/interceptors';

function SponsorTradingDetails() {
  const [sponsors, setSponsors] = useState([]);
  const [profits, setProfits] = useState({});
  const [dematAmounts, setDematAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [savingBoth, setSavingBoth] = useState({});

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors();
        const sponsorData = res?.data || [];

        setSponsors(sponsorData);

        const initialProfits = {};
        const initialDemats = {};
        sponsorData.forEach((s) => {
          initialProfits[s.sponsor_id] = s.profit ?? '';
          initialDemats[s.sponsor_id] = s.demat_amount ?? '';
        });

        setProfits(initialProfits);
        setDematAmounts(initialDemats);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const handleProfitChange = (sponsorId, value) => {
    setProfits((prev) => ({ ...prev, [sponsorId]: value }));
  };

  const handleDematChange = (sponsorId, value) => {
    setDematAmounts((prev) => ({ ...prev, [sponsorId]: value }));
  };
 
  const handleSaveBoth = async (sponsorId) => {
    const profitValue = profits[sponsorId];
    const dematValue = dematAmounts[sponsorId];
  
    if (profitValue === '' || isNaN(profitValue)) {
      alert('Please enter a valid profit value.');
      return;
    }
  
    if (dematValue === '' || isNaN(dematValue)) {
      alert('Please enter a valid demat amount.');
      return;
    }
  
    setSavingBoth((prev) => ({ ...prev, [sponsorId]: true }));
    setSuccessMsg('');
  
    try {
      const [profitRes, dematRes] = await Promise.all([
        updateProfit(sponsorId, { profit: parseFloat(profitValue) }),
        updateDematAmount(sponsorId, { demat_amount: parseFloat(dematValue) }, false)
      ]);
  
      // Update state with responses
      setSponsors((prev) =>
        prev.map((s) =>
          s.sponsor_id === sponsorId
            ? { ...s, profit: profitRes.data.profit, demat_amount: dematRes.demat_amount }
            : s
        )
      );
  
      setProfits((prev) => ({ ...prev, [sponsorId]: profitRes.data.profit }));
      setDematAmounts((prev) => ({ ...prev, [sponsorId]: dematRes.demat_amount }));
    } catch (error) {
      console.error('Error saving sponsor data:', error);
      if (error?.response?.status === 404) {
        alert(`Demat Amount failed: No payment option found for ${sponsorId}`);
      } else {
        alert('Failed to update profit or demat amount.');
      }
    } finally {
      setSavingBoth((prev) => ({ ...prev, [sponsorId]: false }));
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sponsor Trading Details
      </Typography>

      {successMsg && (
        <Typography variant="subtitle1" color="success.main" mb={2}>
          {successMsg}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Sponsor ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Demat Amount</strong></TableCell>
              <TableCell><strong>Profit</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sponsors.map((sponsor) => (
              <TableRow key={sponsor.sponsor_id}>
                <TableCell>{sponsor.sponsor_id}</TableCell>
                <TableCell>{sponsor.username}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={dematAmounts[sponsor.sponsor_id]}
                    onChange={(e) => handleDematChange(sponsor.sponsor_id, e.target.value)
                    }
                    placeholder="Enter Demat Amount"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={profits[sponsor.sponsor_id]}
                    onChange={(e) => handleProfitChange(sponsor.sponsor_id, e.target.value)
                    }
                    placeholder="Enter Profit"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    disabled={savingBoth[sponsor.sponsor_id]}
                    onClick={() => handleSaveBoth(sponsor.sponsor_id)}
                  >
                    {savingBoth[sponsor.sponsor_id] ? 'Saving...' : 'Save'}
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default SponsorTradingDetails;
