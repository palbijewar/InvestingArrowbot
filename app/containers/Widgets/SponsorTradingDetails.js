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
import { getAllSponsors } from '../../middlewares/interceptors';

function SponsorTradingDetails() {
  const [sponsors, setSponsors] = useState([]);
  const [profits, setProfits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors();
        setSponsors(res?.data || []);
      } catch (error) {
        console.error('Failed to fetch sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const handleProfitChange = (sponsorId, value) => {
    setProfits((prev) => ({
      ...prev,
      [sponsorId]: value,
    }));
  };

  const handleSaveProfit = async (sponsorId) => {
    const profitValue = profits[sponsorId];
    if (!profitValue || isNaN(profitValue)) return;

    setSaving((prev) => ({ ...prev, [sponsorId]: true }));

    try {
      await updateAmount(sponsorId, { profit: parseFloat(profitValue) });
      alert('Profit updated successfully!');
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
                    value={profits[sponsor.sponsor_id] || ''}
                    onChange={(e) =>
                      handleProfitChange(sponsor.sponsor_id, e.target.value)
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
