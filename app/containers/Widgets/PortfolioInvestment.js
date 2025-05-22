import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

function PortfolioInvestment() {
  const [portfolio, setPortfolio] = React.useState('');
  const [amount, setAmount] = React.useState('100');

  return (
    <Box p={3}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Investment
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Fund Balance: <strong>$4850</strong>
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Portfolio</InputLabel>
            <Select
              value={portfolio}
              label="Select Portfolio"
              onChange={(e) => setPortfolio(e.target.value)}
            >
              <MenuItem value="crypto">Crypto</MenuItem>
              <MenuItem value="stocks">Stocks</MenuItem>
              <MenuItem value="gold">Gold</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Box my={2}>
            <Typography variant="body2">
              Gas Fees ($): <strong>10.00</strong>
            </Typography>
          </Box>

          <Button variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PortfolioInvestment;
