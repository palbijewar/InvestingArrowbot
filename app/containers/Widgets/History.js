import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Box, Chip
} from '@mui/material';

const sampleTrades = [
  {
    id: 1,
    date: '2025-05-01',
    asset: 'BTC/USDT',
    type: 'Buy',
    amount: '0.05 BTC',
    price: '60,000 USDT',
    status: 'Completed'
  },
  {
    id: 2,
    date: '2025-05-03',
    asset: 'ETH/USDT',
    type: 'Sell',
    amount: '1.2 ETH',
    price: '3,200 USDT',
    status: 'Pending'
  },
  {
    id: 3,
    date: '2025-05-06',
    asset: 'XRP/USDT',
    type: 'Buy',
    amount: '500 XRP',
    price: '0.45 USDT',
    status: 'Failed'
  }
];

function History() {
  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Trade History
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.asset}</TableCell>
                <TableCell>
                  <Chip
                    label={trade.type}
                    color={trade.type === 'Buy' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{trade.amount}</TableCell>
                <TableCell>{trade.price}</TableCell>
                <TableCell>
                  <Chip
                    label={trade.status}
                    color={
                      trade.status === 'Completed' ? 'primary'
                        : trade.status === 'Pending' ? 'warning'
                          : 'default'
                    }
                    variant="filled"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default History;
