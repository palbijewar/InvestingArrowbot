import React, { useEffect, useState } from 'react';
import { getAllSponsors, activateUser } from '../../middlewares/interceptors.js';

function AdminTable() {
  const [sponsors, setSponsors] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await getAllSponsors();

        setSponsors(res.data);
      } catch (err) {
        console.error('Failed to fetch sponsors:', err);
      }
    };

    fetchSponsors();
  }, []);

  const handleToggle = async (sponsorId, currentStatus) => {
    setLoadingId(sponsorId);
    try {
      await activateUser(sponsorId);
      setSponsors((prev) => prev.map((sponsor) => (sponsor.sponsor_id === sponsorId
        ? { ...sponsor, is_active: !currentStatus }
        : sponsor)
      )
      );
    } catch (error) {
      console.error('Activation failed', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sponsor Management</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sponsor ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Package</th>
            <th className="border p-2">Is Active</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.sponsor_id} className="text-center">
              <td className="border p-2">{sponsor.sponsor_id}</td>
              <td className="border p-2">{sponsor.username}</td>
              <td className="border p-2">{sponsor.email}</td>
              <td className="border p-2">{sponsor.phone}</td>
              <td className="border p-2">{sponsor.package || 'N/A'}</td>
              <td className="border p-2">{sponsor.is_active ? 'Yes' : 'No'}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleToggle(sponsor.sponsor_id, sponsor.is_active)}
                  disabled={loadingId === sponsor.sponsor_id}
                  className={`px-3 py-1 rounded ${
                    sponsor.is_active ? 'bg-red-500' : 'bg-green-500'
                  } text-white`}
                >
                  {loadingId === sponsor.sponsor_id ? 'Loading...' : sponsor.is_active ? 'Deactivate' : 'Activate'}
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
