import React, { useState } from 'react';
import {
  Button, TextField, Grid, Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function PaymentForm() {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('amount', paymentAmount);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:3000/payment-options', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Payment Options</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Enter Amount"
              type="number"
              fullWidth
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              inputProps={{ min: 0, step: 'any' }}
            />
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
