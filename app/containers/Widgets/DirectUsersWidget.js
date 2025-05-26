import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import { getDirectReferrals } from '../../middlewares/interceptors.js';

function UsersDetailsTable() {
  const [usersData, setUsersData] = useState([]);
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
      getDirectReferrals(sponsorId)
        .then((res) => {
          setUsersData(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to fetch referrals:', err);
        });
    }
  }, [sponsorId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Referrals
      </Typography>

      <TableContainer component={Paper} sx={{ minWidth: 650 }}>
        <Table stickyHeader aria-label="users details table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Sr No.</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Sponsor ID</strong></TableCell>
              <TableCell><strong>Package</strong></TableCell>
              <TableCell><strong>Amount Deposited</strong></TableCell>
              <TableCell><strong>Registration Date</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.sponsor_id}</TableCell>
                <TableCell>{user.package || '-'}</TableCell>
                <TableCell>{user.amount_deposited || '-'}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UsersDetailsTable;
