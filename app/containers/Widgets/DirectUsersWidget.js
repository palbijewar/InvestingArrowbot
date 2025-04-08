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

export default UsersDetailsTable;
