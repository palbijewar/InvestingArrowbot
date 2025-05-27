import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { getGasWalletHistory } from '../../middlewares/interceptors';

function GasHistory() {
  const [history, setHistory] = useState([]);
  const [sponsorId, setSponsorId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get sponsor ID from localStorage on mount
  useEffect(() => {
    const storedSponsorDetails = localStorage.getItem('sponsor_details');
    if (storedSponsorDetails) {
      const sponsorData = JSON.parse(storedSponsorDetails);
      setSponsorId(sponsorData?.sponsor_id);
    }
  }, []);

  // Fetch gas wallet history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!sponsorId) return;

      try {
        setLoading(true);
        const res = await getGasWalletHistory(sponsorId);
        setHistory(res?.data || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load gas wallet history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sponsorId]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Gas Wallet History
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && history.length > 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="gas history table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Sponsor ID</TableCell>
                <TableCell>Sponsor Name</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>{item.sponsor_id}</TableCell>
                  <TableCell>{item.sponsor_name}</TableCell>
                  <TableCell>₹{item.gas_wallet_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && !error && history.length === 0 && sponsorId && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No history found for Sponsor ID: {sponsorId}
        </Typography>
      )}
    </Container>
  );
}

export default GasHistory;
