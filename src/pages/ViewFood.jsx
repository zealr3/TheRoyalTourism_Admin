import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFood from './AddFood'; // ✅ Make sure the path is correct

const AdminFoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDid, setSelectedDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFoods = async (did = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = did
        ? `http://localhost:5000/api/foods/list?did=${did}`
        : 'http://localhost:5000/api/foods/list';
      console.log('Fetching foods from:', url); // Debug
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('API response:', res.data); // Debug
      setFoods(res.data.foods || res.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response || err); // Debug
      setError(err.response?.data?.error || 'Failed to fetch food data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      console.log('Destinations:', res.data); // Debug
      setDestinations(res.data || []);
    } catch (err) {
      console.error('Destinations error:', err.response || err); // Debug
      setError('Failed to load destinations');
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchFoods(); // Initial fetch
  }, []);

  const handleFilterChange = (e) => {
    const did = e.target.value;
    setSelectedDid(did);
    fetchFoods(did);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Food Management</h1>

      {/* Add Food Form */}
      <div className="mb-8">
        <AddFood onFoodAdded={() => fetchFoods(selectedDid)} />
      </div>

      {/* Filter by Destination */}
      <div className="mb-6">
        <label htmlFor="didFilter" className="block text-gray-700 mb-2 font-medium">
          Filter by Destination
        </label>
        <select
          id="didFilter"
          value={selectedDid}
          onChange={handleFilterChange}
          className="w-full max-w-xs p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Destinations</option>
          {destinations.map((dest) => (
            <option key={dest.did} value={dest.did}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Data Table */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Food Detail</th>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Destination ID</th>
              </tr>
            </thead>
            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                    No food data found
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.fid} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{food.fid}</td>
                    <td className="py-3 px-4">{food.fdetail}</td>
                    <td className="py-3 px-4">
                      <img
                        src={food.fimg}
                        alt={food.fdetail}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
                      />
                    </td>
                    <td className="py-3 px-4">{food.did}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFoodManagement;