import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFood from './AddFood';

const AdminFoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [Destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFoods = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = 'http://localhost:5000/api/foods';
      console.log('Fetching foods from:', url);
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('API response:', res.data);
      setFoods(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to fetch food data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      console.log('Destinations:', res.data);
      setDestinations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Destinations error:', err.response || err);
      setError('Failed to load destinations');
    }
  };

  const handleDelete = async (fid) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete food items');
        return;
      }

      console.log('Deleting food with ID:', fid);
      await axios.delete(`http://localhost:5000/api/foods/${fid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods((prev) => prev.filter((food) => food.fid !== fid));
      setSuccess('Food item deleted successfully!');
      setError('');
    } catch (err) {
      console.error('Delete error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to delete food item');
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchFoods();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Food Management</h1>

      <div className="mb-8">
        <AddFood onFoodAdded={fetchFoods} />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4 animate-pulse">{success}</p>}
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
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
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
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(food.fid)}
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
  );
};

export default AdminFoodManagement;