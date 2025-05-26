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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { getDirectReferrals } from '../../middlewares/interceptors.js';

function UsersDetailsTable() {
  const [usersData, setUsersData] = useState([]);
  const [sponsorId, setSponsorId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const headerCellStyle = {
    whiteSpace: 'nowrap',
    fontSize: { xs: '0.7rem', sm: '0.85rem' },
    padding: { xs: '6px 8px', sm: '8px 12px' },
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
              <TableCell sx={headerCellStyle}><strong>Sr No.</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Username</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Sponsor ID</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Package</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Amount</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Reg. Date</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Active</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={headerCellStyle}>{index + 1}</TableCell>
                <TableCell sx={headerCellStyle}>{user.username}</TableCell>
                <TableCell sx={headerCellStyle}>{user.sponsor_id}</TableCell>
                <TableCell sx={headerCellStyle}>{user.package || '-'}</TableCell>
                <TableCell sx={headerCellStyle}>{user.amount_deposited || '-'}</TableCell>
                <TableCell sx={headerCellStyle}>{formatDate(user.createdAt)}</TableCell>
                <TableCell sx={headerCellStyle}>{user.is_active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UsersDetailsTable;
