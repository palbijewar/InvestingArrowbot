import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { injectIntl } from 'react-intl';
import useStyles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

function FilesWidget() {
  const { classes } = useStyles();

  // State for Forex Form
  const [forexDetails, setForexDetails] = useState({
    name: '',
    amount: '',
    currency: '',
  });

  const handleChange = (e) => {
    setForexDetails({ ...forexDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Grid container spacing={3}>
        <PapperBlock title="Forex Details" icon="monetization_on" whiteBg desc="Enter forex details below:">
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Forex Name"
              name="name"
              value={forexDetails.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={forexDetails.amount}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              select
              label="Currency"
              name="currency"
              value={forexDetails.currency}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </TextField>
            <Divider className={classes.divider} />
            <Grid container justifyContent="center">
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </Grid>
          </form>
        </PapperBlock>
      </Grid>
  );
}

FilesWidget.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FilesWidget);
