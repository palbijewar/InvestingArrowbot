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
import { getAllSponsors, updateProfit } from '../../middlewares/interceptors';

function SponsorTradingDetails() {
  const [sponsors, setSponsors] = useState([]);
  const [profits, setProfits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors();
        const sponsorData = res?.data || [];
        setSponsors(sponsorData);

        // Initialize profits from sponsor.profit
        const initialProfits = {};
        sponsorData.forEach((s) => {
          initialProfits[s.sponsor_id] = s.profit ?? '';
        });
        setProfits(initialProfits);
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

  const handleSaveProfit = async (sponsorId) => {
    const profitValue = profits[sponsorId];
    if (profitValue === '' || isNaN(profitValue)) {
      alert('Please enter a valid profit value.');
      return;
    }

    setSaving((prev) => ({ ...prev, [sponsorId]: true }));
    setSuccessMsg('');

    try {
      const payload = { profit: parseFloat(profitValue) };
      const res = await updateProfit(sponsorId, payload);

      // 1) Update sponsors state so sponsor.profit is current
      setSponsors((prev) => prev.map((s) => (s.sponsor_id === sponsorId ? { ...s, profit: res.data.profit } : s)
      )
      );

      // 2) Update profits state so the input shows the saved value
      setProfits((prev) => ({
        ...prev,
        [sponsorId]: res.data.profit,
      }));

      setSuccessMsg(`Profit for ${sponsorId} updated to ${res.data.profit}`);
    } catch (error) {
      console.error('Error updating profit:', error);
      alert('Failed to update profit.');
    } finally {
      setSaving((prev) => ({ ...prev, [sponsorId]: false }));
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
              <TableCell><strong>Profit</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
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
                    value={profits[sponsor.sponsor_id]}
                    onChange={(e) => handleProfitChange(sponsor.sponsor_id, e.target.value)
                    }
                    placeholder="Enter profit"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={saving[sponsor.sponsor_id]}
                    onClick={() => handleSaveProfit(sponsor.sponsor_id)}
                  >
                    {saving[sponsor.sponsor_id] ? 'Saving...' : 'Save'}
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
