import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDid, setSelectedDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newActivity, setNewActivity] = useState({
    adetail: '',
    alocation: '',
    aactivity: '',
    aimg: '',
    best_time: '',
    did: '',
  });

  const fetchActivities = async (did = '') => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = did
        ? `http://localhost:5000/api/activities/list?did=${did}`
        : 'http://localhost:5000/api/activities/list';
      console.log('Fetching activities from:', url);
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setActivities(res.data.activities || res.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      console.log('Destinations:', res.data);
      setDestinations(res.data || []);
    } catch (err) {
      console.error('Destinations error:', err.response || err);
      setError('Failed to load destinations');
    }
  };

  const handleInputChange = (e) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { adetail, alocation, aactivity, aimg, best_time, did } = newActivity;
      if (!adetail || !alocation || !aactivity || !aimg || !best_time || !did) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token') || '';
      if (!token) {
        setError('You must be logged in to add activities');
        setLoading(false);
        return;
      }
      await axios.post(
        'http://localhost:5000/api/activities',
        { adetail, alocation, aactivity, aimg, best_time, did: parseInt(did) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Activity added successfully!');
      setNewActivity({
        adetail: '',
        alocation: '',
        aactivity: '',
        aimg: '',
        best_time: '',
        did: '',
      });
      fetchActivities(selectedDid);
    } catch (err) {
      console.error('Add activity error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (aid) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete activities');
        setLoading(false);
        return;
      }

      console.log('Deleting activity with ID:', aid);
      await axios.delete(`http://localhost:5000/api/activities/${aid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities((prev) => prev.filter((activity) => activity.aid !== aid));
      setSuccess('Activity deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const did = e.target.value;
    setSelectedDid(did);
    fetchActivities(did);
  };

  useEffect(() => {
    fetchDestinations();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Activity Management</h1>

      {/* Add Activity Form */}
      <div className="w-full max-w-lg mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Activity</h2>
          {success && (
            <p className="text-green-600 bg-green-100 p-3 rounded-md mb-6 animate-pulse">{success}</p>
          )}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>
          )}
          <form onSubmit={handleAddActivity}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="aactivity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Activity Name
                </label>
                <input
                  type="text"
                  id="aactivity"
                  name="aactivity"
                  value={newActivity.aactivity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter activity name"
                />
              </div>
              <div>
                <label
                  htmlFor="adetail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Activity Detail
                </label>
                <textarea
                  id="adetail"
                  name="adetail"
                  value={newActivity.adetail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter activity details"
                  rows="4"
                />
              </div>
              <div>
                <label
                  htmlFor="alocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="alocation"
                  name="alocation"
                  value={newActivity.alocation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label
                  htmlFor="aimg"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="aimg"
                  name="aimg"
                  value={newActivity.aimg}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label
                  htmlFor="best_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Best Time
                </label>
                <input
                  type="text"
                  id="best_time"
                  name="best_time"
                  value={newActivity.best_time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter best time (e.g., Summer)"
                />
              </div>
              <div>
                <label
                  htmlFor="did"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destination
                </label>
                <select
                  id="did"
                  name="did"
                  value={newActivity.did}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((d) => (
                    <option key={d.did} value={d.did}>
                      {d.dname || d.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {loading ? 'Adding...' : 'Add Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filter by Destination */}
      <div className="w-full max-w-lg mb-8">
        <label
          htmlFor="didFilter"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filter by Destination
        </label>
        <select
          id="didFilter"
          value={selectedDid}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Destinations</option>
          {destinations.map((d) => (
            <option key={d.did} value={d.did}>
              {d.dname || d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Data Table */}
      <div className="w-full max-w-7xl">
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-xs">
                  <th className="py-4 px-6 text-left">ID</th>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Detail</th>
                  <th className="py-4 px-6 text-left">Location</th>
                  <th className="py-4 px-6 text-left">Image</th>
                  <th className="py-4 px-6 text-left">Best Time</th>
                  <th className="py-4 px-6 text-left">Destination ID</th>
                  <th className="py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-6 px-6 text-center text-gray-500"
                    >
                      No activities found
                    </td>
                  </tr>
                ) : (
                  activities.map((a) => (
                    <tr
                      key={a.aid}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">{a.aid}</td>
                      <td className="py-4 px-6">{a.aactivity}</td>
                      <td className="py-4 px-6">
                        {a.adetail.substring(0, 50)}...
                      </td>
                      <td className="py-4 px-6">{a.alocation}</td>
                      <td className="py-4 px-6">
                        <img
                          src={a.aimg}
                          alt={a.aactivity}
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) =>
                            (e.target.src = 'https://via.placeholder.com/48')
                          }
                        />
                      </td>
                      <td className="py-4 px-6">{a.best_time}</td>
                      <td className="py-4 px-6">{a.did}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(a.aid)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityManagement;