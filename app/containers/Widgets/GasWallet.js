import React, { useState } from 'react';

function GasWallet() {
  const [sponsorId, setSponsorId] = useState('');
  const [gasFees, setGasFees] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic here (e.g., API call)
    console.log('Sponsor ID:', sponsorId);
    console.log('Gas Wallet Fees:', gasFees);
    // Reset form
    setSponsorId('');
    setGasFees('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
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
            style={{
              width: '100%',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default GasWallet;
