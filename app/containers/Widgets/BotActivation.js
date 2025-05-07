import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Grid, Chip
} from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function BotActivation() {
  const [isActivated, setIsActivated] = useState(false);

  const handleToggle = () => {
    setIsActivated(prev => !prev);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Bot Activation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AndroidIcon color="primary" />
                <Typography variant="subtitle1">
                  Trading Bot Status
                </Typography>
              </Box>

              <Typography variant="body1" gutterBottom>
                The trading bot helps automate buy/sell decisions based on your strategy.
              </Typography>

              <Box mt={2} mb={2}>
                <Chip
                  label={isActivated ? 'Activated' : 'Not Activated'}
                  color={isActivated ? 'success' : 'default'}
                  icon={isActivated ? <CheckCircleIcon /> : <HighlightOffIcon />}
                />
              </Box>

              <Button
                variant="contained"
                color={isActivated ? 'error' : 'primary'}
                onClick={handleToggle}
              >
                {isActivated ? 'Deactivate Bot' : 'Activate Bot'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Bot Statistics
              </Typography>
              <Typography variant="body2">Total Trades: 248</Typography>
              <Typography variant="body2">Success Rate: 78%</Typography>
              <Typography variant="body2">Profit Generated: $3,420</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BotActivation;
