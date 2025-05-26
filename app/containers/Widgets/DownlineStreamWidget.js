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
import { getSecondLevelReferrals } from '../../middlewares/interceptors';

export default function DownlineUsersWidget() {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const sponsorDetails = JSON.parse(localStorage.getItem('sponsor_details'));
    const sponsorId = sponsorDetails?.sponsor_id;

    if (sponsorId) {
      getSecondLevelReferrals(sponsorId)
        .then((res) => {
          setUsersData(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to fetch second-level referrals:', err);
        });
    }
  }, []);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Second-Level Referrals
      </Typography>

      <TableContainer component={Paper} sx={{ minWidth: 800 }}>
        <Table stickyHeader aria-label="second level referral users table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Sr. No.</strong></TableCell>
              <TableCell><strong>Registration Date</strong></TableCell>
              <TableCell><strong>Sponsor ID</strong></TableCell>
              <TableCell><strong>Sponsor Name</strong></TableCell>
              <TableCell><strong>Referral ID</strong></TableCell>
              <TableCell><strong>Referral Username</strong></TableCell>
              <TableCell><strong>Package</strong></TableCell>
              <TableCell><strong>Amount Deposited</strong></TableCell>
              <TableCell><strong>Level</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{new Date(user.registration_date).toLocaleDateString()}</TableCell>
                <TableCell>{user.sponsor_id}</TableCell>
                <TableCell>{user.sponsor_name}</TableCell>
                <TableCell>{user.referral_id}</TableCell>
                <TableCell>{user.referral_username}</TableCell>
                <TableCell>{user.package || '-'}</TableCell>
                <TableCell>{user.amount_deposited || '-'}</TableCell>
                <TableCell>{user.level || '-'}</TableCell>
                <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
