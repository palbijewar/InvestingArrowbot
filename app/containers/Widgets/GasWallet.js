import React, { useState } from 'react';
import { updateGasWalletAmount } from '../../middlewares/interceptors';
import newQrCode from '../../api/images/newqr.jpg';
import {
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function GasWallet() {
  const [sponsorId, setSponsorId] = useState('');
  const [gasFees, setGasFees] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = 'TMrquvJNB8NDG4VKW4NpvRUdPqC5y9DiRz';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        sponsor_id: sponsorId,
        gas_wallet_amount: Number(gasFees),
        is_active: false,
      };
      const storedSponsorDetails = localStorage.getItem('sponsor_details');
      const sponsorData = JSON.parse(storedSponsorDetails);
      const res = await updateGasWalletAmount(sponsorData?.sponsor_id, payload);
      setMessage(res.message || 'Wallet created successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setSponsorId('');
      setGasFees('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', flexWrap: 'wrap'
    }}>
      {/* Form Card */}
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          width: '350px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Sponsor ID</label>
            <input
              type="text"
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              required
              placeholder="Enter Sponsor ID"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '0.5rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label>Gas Wallet Fees</label>
            <input
              type="number"
              value={gasFees}
              onChange={(e) => setGasFees(e.target.value)}
              required
              placeholder="Enter Gas Wallet Fees"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '0.5rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#aaa' : '#007bff',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </div>

      {/* QR Code Scanner Section */}
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          width: '350px',
          textAlign: 'center',
        }}
      >
        <img
          src={newQrCode}
          alt="Scan QR"
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            marginBottom: '1rem',
          }}
        />
        <Typography variant="body1" align="center" gutterBottom>
          <strong>Note:</strong> Only send Tether (TRC20) assets to this address.
          <br />
          Scan this QR code for payment details.
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <Typography
            variant="body2"
            sx={{ wordBreak: 'break-all', textAlign: 'center', mr: 1 }}
          >
            {walletAddress}
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy'}>
            <IconButton onClick={handleCopy} size="small" aria-label="Copy wallet address">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </div>
  );
}

export default GasWallet;
