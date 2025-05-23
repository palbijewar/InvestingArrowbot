import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sponsorPaymentHistory } from '../../middlewares/interceptors';

function SponsorTradingHistory() {
  const { sponsorId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await sponsorPaymentHistory(sponsorId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sponsor payment history.');
      } finally {
        setLoading(false);
      }
    };

    if (sponsorId) {
      fetchHistory();
    }
  }, [sponsorId]);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;
  if (!data.length) return <p className="text-center p-4">No payment history found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sponsor Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Sponsor Name</th>
              <th className="border px-4 py-2 text-left">Sponsor ID</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Demat Amount</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">File</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{entry.sponsor_name}</td>
                <td className="border px-4 py-2">{entry.sponsor_id}</td>
                <td className="border px-4 py-2">₹{entry.amount.toLocaleString()}</td>
                <td className="border px-4 py-2">₹{entry.demat_amount.toLocaleString()}</td>
                <td className="border px-4 py-2">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <a
                    href={entry.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SponsorTradingHistory;
