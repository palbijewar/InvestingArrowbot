import React, { useState } from 'react';
import { createGasWallet } from '../../middlewares/interceptors';

function GasWallet() {
  const [sponsorId, setSponsorId] = useState('');
  const [gasFees, setGasFees] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        sponsor_id: sponsorId,
        gas_wallet_amount: Number(gasFees),
      };

      const res = await createGasWallet(payload);
      setMessage(res.message || 'Wallet created successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setSponsorId('');
      setGasFees('');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
    </div>
  );
}

export default GasWallet;
