import React from 'react';
import {
  Card, CardContent, Typography, Box, Grid, LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const portfolioData = [
  {
    title: 'Total Invested',
    value: '$12,500',
    icon: <AccountBalanceWalletIcon color="primary" />,
  },
  {
    title: 'Current Value',
    value: '$14,200',
    icon: <TrendingUpIcon color="success" />,
  },
  {
    title: 'Diversification',
    value: 'Crypto 60%, Stocks 30%, Gold 10%',
    icon: <PieChartIcon color="secondary" />,
  },
];

const progress = 78; // sample portfolio growth %

function PortfolioInvestment() {
  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Portfolio Overview
      </Typography>
      <Grid container spacing={3}>
        {portfolioData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {item.icon}
                  <Typography variant="subtitle1" ml={1}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="h6">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Portfolio Growth
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  {progress}% Growth
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PortfolioInvestment;
