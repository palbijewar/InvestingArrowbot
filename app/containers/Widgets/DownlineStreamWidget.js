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
import { getSecondLevelReferrals } from '../../middlewares/interceptors';

export default function DownlineUsersWidget() {
  const [usersData, setUsersData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const headerCellStyle = {
    whiteSpace: 'nowrap',
    fontSize: { xs: '0.7rem', sm: '0.85rem' },
    padding: { xs: '6px 8px', sm: '8px 12px' },
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', p: { xs: 1, sm: 2 } }}>

      <TableContainer component={Paper} sx={{ minWidth: 800 }}>
        <Table stickyHeader aria-label="second level referral users table">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle}><strong>Sr. No.</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Reg. Date</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Sponsor ID</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Sponsor Name</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Referral ID</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Referral Username</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Package</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Amount</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Level</strong></TableCell>
              <TableCell sx={headerCellStyle}><strong>Active</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={headerCellStyle}>{index + 1}</TableCell>
                <TableCell sx={headerCellStyle}>{new Date(user.registration_date).toLocaleDateString()}</TableCell>
                <TableCell sx={headerCellStyle}>{user.sponsor_id}</TableCell>
                <TableCell sx={headerCellStyle}>{user.sponsor_name}</TableCell>
                <TableCell sx={headerCellStyle}>{user.referral_id}</TableCell>
                <TableCell sx={headerCellStyle}>{user.referral_username}</TableCell>
                <TableCell sx={headerCellStyle}>{user.package || '-'}</TableCell>
                <TableCell sx={headerCellStyle}>{user.amount_deposited || '-'}</TableCell>
                <TableCell sx={headerCellStyle}>{user.level || '-'}</TableCell>
                <TableCell sx={headerCellStyle}>{user.is_active ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
