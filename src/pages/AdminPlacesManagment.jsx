import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPlaceManagement = () => {
  const [places, setPlaces] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDid, setSelectedDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPlace, setNewPlace] = useState({
    pl_detail: '',
    pl_best_time: '',
    pl_location: '',
    pl_img: '',
    did: '',
  });

  const fetchPlaces = async (did = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = did
        ? `http://localhost:5000/api/places/list?did=${did}`
        : 'http://localhost:5000/api/places/list';
      console.log('Fetching places from:', url);
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPlaces(res.data.places || res.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to fetch place data');
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
    setNewPlace({ ...newPlace, [e.target.name]: e.target.value });
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { pl_detail, pl_best_time, pl_location, pl_img, did } = newPlace;
      if (!pl_detail || !pl_best_time || !pl_location || !pl_img || !did) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token') || '';
      await axios.post(
        'http://localhost:5000/api/places',
        { pl_detail, pl_best_time, pl_location, pl_img, did: parseInt(did) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSuccess('Place added successfully!');
      setNewPlace({ pl_detail: '', pl_best_time: '', pl_location: '', pl_img: '', did: '' });
      fetchPlaces(selectedDid);
    } catch (err) {
      console.error('Add place error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to add place');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const did = e.target.value;
    setSelectedDid(did);
    fetchPlaces(did);
  };

  useEffect(() => {
    fetchDestinations();
    fetchPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Place Management</h1>

      {/* Add Place Form */}
      <div className="w-full max-w-lg mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Place</h2>
          {success && (
            <p className="text-green-600 bg-green-100 p-3 rounded-md mb-6">{success}</p>
          )}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>
          )}
          <form onSubmit={handleAddPlace}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="pl_detail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Place Detail
                </label>
                <textarea
                  id="pl_detail"
                  name="pl_detail"
                  value={newPlace.pl_detail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter place details"
                  rows="4"
                />
              </div>
              <div>
                <label
                  htmlFor="pl_location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="pl_location"
                  name="pl_location"
                  value={newPlace.pl_location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label
                  htmlFor="pl_img"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="pl_img"
                  name="pl_img"
                  value={newPlace.pl_img}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label
                  htmlFor="pl_best_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Best Time
                </label>
                <input
                  type="text"
                  id="pl_best_time"
                  name="pl_best_time"
                  value={newPlace.pl_best_time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter best time (e.g., October to March)"
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
                  value={newPlace.did}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((d) => (
                    <option key={d.did} value={d.did}>
                      {d.name}
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
                {loading ? 'Adding...' : 'Add Place'}
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
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Place Data Table */}
      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-xs">
                  <th className="py-4 px-6 text-left">ID</th>
                  <th className="py-4 px-6 text-left">Detail</th>
                  <th className="py-4 px-6 text-left">Location</th>
                  <th className="py-4 px-6 text-left">Image</th>
                  <th className="py-4 px-6 text-left">Best Time</th>
                  <th className="py-4 px-6 text-left">Destination ID</th>
                </tr>
              </thead>
              <tbody>
                {places.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 px-6 text-center text-gray-500"
                    >
                      No places found
                    </td>
                  </tr>
                ) : (
                  places.map((p) => (
                    <tr
                      key={p.pl_id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">{p.pl_id}</td>
                      <td className="py-4 px-6">
                        {p.pl_detail.substring(0, 50)}...
                      </td>
                      <td className="py-4 px-6">{p.pl_location}</td>
                      <td className="py-4 px-6">
                        <img
                          src={p.pl_img}
                          alt="Place"
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) =>
                            (e.target.src = 'https://via.placeholder.com/48')
                          }
                        />
                      </td>
                      <td className="py-4 px-6">{p.pl_best_time}</td>
                      <td className="py-4 px-6">{p.did}</td>
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

export default AdminPlaceManagement;