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
      <Table aria-label="users details table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Username</strong></TableCell>
            <TableCell><strong>Sponsor ID</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.sponsor_id}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
