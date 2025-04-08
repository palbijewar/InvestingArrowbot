import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const usersData = [
  { username: 'john_doe', sponsorId: 'SP12345', email: 'john@example.com' },
  { username: 'jane_smith', sponsorId: 'SP67890', email: 'jane@example.com' },
  { username: 'alex_k', sponsorId: 'SP54321', email: 'alex@example.com' }
];

export default function DownlineUsersWidget() {
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
              <TableCell>{user.sponsorId}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
