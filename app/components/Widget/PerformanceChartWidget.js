import React, { useState } from 'react';
import {
  Button, FormControl, InputLabel, MenuItem, Select, Grid, Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [file, setFile] = useState(null);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Payment Method:', paymentMethod);
    console.log('Uploaded File:', file);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Payment Options</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Payment</InputLabel>
              <Select value={paymentMethod} onChange={handlePaymentChange} required>
                <MenuItem value="$10">$10</MenuItem>
                <MenuItem value="$20">$20</MenuItem>
                <MenuItem value="$50">$50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
            Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">Selected File: {file.name}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
            Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default PaymentForm;
