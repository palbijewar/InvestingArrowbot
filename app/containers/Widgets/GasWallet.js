import React from 'react';

function GasHistory() {
  const dummyData = [
    { id: 1, date: '2025-05-01', gasUsed: '120 gwei', transaction: '0xabc123...' },
    { id: 2, date: '2025-05-03', gasUsed: '98 gwei', transaction: '0xdef456...' },
    { id: 3, date: '2025-05-05', gasUsed: '110 gwei', transaction: '0xghi789...' },
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Gas History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Gas Used</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.gasUsed}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{item.transaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GasHistory;
