import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
    <TableContainer component={Paper}>
      <Table aria-label="users details table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Sr No.</strong></TableCell>
            <TableCell><strong>Username</strong></TableCell>
            <TableCell><strong>Sponsor ID</strong></TableCell>
            <TableCell><strong>Package</strong></TableCell>
            <TableCell><strong>Registration Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.sponsor_id}</TableCell>
              <TableCell>{user.package || '-'}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersDetailsTable;
