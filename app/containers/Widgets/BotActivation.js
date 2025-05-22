import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function BotActivation() {
  const [isActivated, setIsActivated] = useState(false);
  const [userId, setUserId] = useState('');
  const [userIdError, setUserIdError] = useState(false);

  const handleToggle = () => {
    setIsActivated(prev => !prev);
  };

  const handleSubmit = () => {
    if (!userId.trim()) {
      setUserIdError(true);
      return;
    }

    setUserIdError(false);
    // Perform submission logic here
    alert(`Bot activated for user ID: ${userId}`);
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
                Fund Balance: <strong>$4850</strong>
              </Typography>

              <Box mt={2} mb={2}>
                <TextField
                  label="User ID"
                  fullWidth
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  error={userIdError}
                  helperText={userIdError ? 'Enter ID Not Correct' : ''}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Amount"
                  fullWidth
                  value={25}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BotActivation;
