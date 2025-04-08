/* eslint-disable prefer-arrow-callback */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { injectIntl } from 'react-intl';
import useStyles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';
import { createBroker } from '../../middlewares/interceptors.js';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function FilesWidget() {
  const { classes } = useStyles();

  const [brokerDetails, setBrokerDetails] = useState({
    brokerName: '',
    userId: '',
    password: '',
    serverId: '',
    totalFund: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setBrokerDetails({ ...brokerDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBroker(brokerDetails);

      setBrokerDetails({
        brokerName: '',
        userId: '',
        password: '',
        serverId: '',
        totalFund: '',
      });

      setOpenSnackbar(true); // Show success popup
    } catch (error) {
      console.error('Broker creation failed:', error);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Grid container spacing={3}>
      <PapperBlock
        title="Broker Details"
        icon="account_balance_wallet"
        whiteBg
        desc="Enter broker details below:"
      >
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Broker Name"
            name="brokerName"
            value={brokerDetails.brokerName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="User ID"
            name="userId"
            value={brokerDetails.userId}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={brokerDetails.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Server ID"
            name="serverId"
            value={brokerDetails.serverId}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Total Fund in Broker"
            name="totalFund"
            type="number"
            value={brokerDetails.totalFund}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </Grid>
        </form>
      </PapperBlock>

      {/* Snackbar Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Broker details saved successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

FilesWidget.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FilesWidget);
