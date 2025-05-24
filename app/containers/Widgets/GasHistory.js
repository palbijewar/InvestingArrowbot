import React, { useEffect, useState } from 'react';
import { getGasWalletHistory } from '../../middlewares/interceptors';

function GasHistory() {
  const [history, setHistory] = useState([]);
  const [sponsorId, setSponsorId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get sponsor ID from localStorage on mount
  useEffect(() => {
    const storedSponsorDetails = localStorage.getItem('sponsor_details');
    if (storedSponsorDetails) {
      const sponsorData = JSON.parse(storedSponsorDetails);
      setSponsorId(sponsorData?.sponsor_id);
    }
  }, []);

  // Fetch gas wallet history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!sponsorId) return;

      try {
        setLoading(true);
        const res = await getGasWalletHistory(sponsorId);
        setHistory(res?.data || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load gas wallet history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sponsorId]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Gas Wallet History</h2>

      {/* Loader or Error */}
      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table */}
      {!loading && history.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Sponsor ID</th>
                <th style={thStyle}>Sponsor Name</th>
                <th style={thStyle}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={tdStyle}>{item.sponsor_id}</td>
                  <td style={tdStyle}>{item.sponsor_name}</td>
                  <td style={tdStyle}>₹{item.gas_wallet_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && history.length === 0 && sponsorId && (
        <p>No history found for Sponsor ID: {sponsorId}</p>
      )}
    </div>
  );
}

const thStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee',
};

export default GasHistory;
