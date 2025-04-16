/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddFood = ({ onFoodAdded }) => {
  const [fdetail, setFdetail] = useState('');
  const [fimg, setFimg] = useState('');
  const [did, setDid] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/destinations');
        setDestinations(res.data);
      } catch (err) {
        setError('Failed to load destinations');
      }
    };
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!fdetail.trim() || !fimg.trim() || !did) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored
      const res = await axios.post(
        'http://localhost:5000/api/foods',
        { fdetail, fimg, did: parseInt(did) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Food added successfully!');
      setFdetail('');
      setFimg('');
      setDid('');
      if (onFoodAdded) onFoodAdded(); // Trigger refresh
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add food');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Food</h2>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="fdetail">
            Food Detail
          </label>
          <input
            type="text"
            id="fdetail"
            value={fdetail}
            onChange={(e) => setFdetail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter food name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="fimg">
            Food Image URL
          </label>
          <input
            type="text"
            id="fimg"
            value={fimg}
            onChange={(e) => setFimg(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="did">
            Destination
          </label>
          <select
            id="did"
            value={did}
            onChange={(e) => setDid(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a destination</option>
            {destinations.map((dest) => (
              <option key={dest.did} value={dest.did}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? 'Adding...' : 'Add Food'}
        </button>
      </div>
    </div>
  );
};

export default AddFood;