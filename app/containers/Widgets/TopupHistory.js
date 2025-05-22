import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';

const topupData = [
  { date: '3/13/2025 10:49:40 AM', userId: 'CGI409923', userName: 'HARSADEEP', amount: 650, type: 'BOAT' },
  { date: '3/13/2025 10:50:07 AM', userId: 'CGI409923', userName: 'HARSADEEP', amount: 200, type: 'Regular' },
  { date: '4/5/2025 8:28:59 AM', userId: 'CGI255653', userName: 'FREEDOM7', amount: 60, type: 'BOAT' },
  { date: '4/29/2025 8:28:29 PM', userId: 'CGI600333', userName: 'AYUSHMAN2017', amount: 150, type: 'BOAT' },
];

function TopupHistory() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = topupData.filter(
    (row) => row.userId.toLowerCase().includes(searchQuery.toLowerCase())
      || row.userName.toLowerCase().includes(searchQuery.toLowerCase())
      || row.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Topup History
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl size="small">
          <InputLabel>Show</InputLabel>
          <Select
            value={rowsPerPage}
            label="Show"
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((count) => (
              <MenuItem key={count} value={count}>
                {count}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SR.No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>$</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2">
          Showing {Math.min(page * rowsPerPage + 1, filteredData.length)} to{' '}
          {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
          {filteredData.length} entries
        </Typography>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </Box>
  );
}

export default TopupHistory;
