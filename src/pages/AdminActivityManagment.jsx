/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDid, setSelectedDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newActivity, setNewActivity] = useState({ adetail: '', aimg: '', did: '' });

  const fetchActivities = async (did = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = did
        ? `http://localhost:5000/api/activities/list?did=${did}`
        : 'http://localhost:5000/api/activities/list';

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setActivities(res.data.activities || res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      setDestinations(res.data || []);
    } catch (err) {
      setError('Failed to load destinations');
    }
  };

  const handleFilterChange = (e) => {
    const did = e.target.value;
    setSelectedDid(did);
    fetchActivities(did);
  };

  const handleInputChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleAddActivity = async () => {
    try {
      if (!newActivity.adetail || !newActivity.aimg || !newActivity.did) {
        setError('All fields are required');
        return;
      }
      await axios.post('http://localhost:5000/api/activities', newActivity);
      fetchActivities(selectedDid);
      setNewActivity({ adetail: '', aimg: '', did: '' });
    } catch (err) {
      setError('Error adding activity');
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchActivities();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Activity Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Activity</h2>
        <input name="adetail" value={newActivity.adetail} onChange={handleInputChange} placeholder="Activity detail" className="input mb-2" />
        <input name="aimg" value={newActivity.aimg} onChange={handleInputChange} placeholder="Image URL" className="input mb-2" />
        <select name="did" value={newActivity.did} onChange={handleInputChange} className="input mb-4">
          <option value="">Select Destination</option>
          {destinations.map((d) => (
            <option key={d.did} value={d.did}>{d.name}</option>
          ))}
        </select>
        <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded">Add Activity</button>
      </div>

      <div className="mb-6">
        <label htmlFor="didFilter" className="block font-medium mb-2">Filter by Destination</label>
        <select
          id="didFilter"
          value={selectedDid}
          onChange={handleFilterChange}
          className="input"
        >
          <option value="">All Destinations</option>
          {destinations.map((d) => (
            <option key={d.did} value={d.did}>{d.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>ID</th>
              <th>Activity Detail</th>
              <th>Image</th>
              <th>Destination ID</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan="4">No activity found</td></tr>
            ) : (
              activities.map((a) => (
                <tr key={a.aid}>
                  <td>{a.aid}</td>
                  <td>{a.adetail}</td>
                  <td>
                    <img src={a.aimg} alt={a.adetail} className="h-16 w-16" />
                  </td>
                  <td>{a.did}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminActivityManagement;
