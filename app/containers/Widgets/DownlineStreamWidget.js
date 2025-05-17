import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
    <TableContainer component={Paper}>
      <Table aria-label="second level referral users table">
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
              <TableCell>{user.referral_id}</TableCell>
              <TableCell>{user.referral_username}</TableCell>
              <TableCell>{user.sponsor_id}</TableCell>
              <TableCell>{user.sponsor_name}</TableCell>
              <TableCell>{user.package || '-'}</TableCell>
              <TableCell>{user.amount_deposited || '-'}</TableCell>
              <TableCell>{user.level || '-'}</TableCell>
              <TableCell>{user.is_active}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
