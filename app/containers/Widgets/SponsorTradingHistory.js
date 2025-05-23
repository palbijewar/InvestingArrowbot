import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
} from '@mui/material';
import { sponsorPaymentHistory } from '../../middlewares/interceptors';

function SponsorTradingHistory() {
  const [data, setData] = useState([]);
  const [sponsorId, setSponsorId] = useState(null);

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

  return (
    <div className="p-6">
      <Typography variant="h6" gutterBottom>
        Sponsor Payment History
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Sponsor Name</strong></TableCell>
              <TableCell><strong>Sponsor ID</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Demat Amount</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.sponsor_name}</TableCell>
                <TableCell>{entry.sponsor_id}</TableCell>
                <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                <TableCell>₹{entry.demat_amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SponsorTradingHistory;
