import React, { useState } from 'react';
import {
  Button, TextField, Grid, Typography, Snackbar, Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createPaymentOption } from '../../middlewares/interceptors';

function PaymentForm() {
  const [sponsorId, setSponsorId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [dematAmount, setDematAmount] = useState('');
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('sponsor_id', sponsorId);
      formData.append('amount', paymentAmount);
      formData.append('dematAmount', dematAmount);
      formData.append('file', file);

      await createPaymentOption(formData);

      // Reset values
      setSponsorId('');
      setPaymentAmount('');
      setDematAmount('');
      setFile(null);
      setOpenSnackbar(true);
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
              label="Sponsor ID"
              type="text"
              fullWidth
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bot Amount"
              type="number"
              fullWidth
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
              inputProps={{ min: 0, step: 'any' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Demat Amount"
              type="number"
              fullWidth
              value={dematAmount}
              onChange={(e) => setDematAmount(e.target.value)}
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

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Successfully saved payment option!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PaymentForm;
