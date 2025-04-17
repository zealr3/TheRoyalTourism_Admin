// src/components/ManageDestinations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageDestinations = () => {
  // State for adding destinations
  const [destinationData, setDestinationData] = useState({
    name: '',
    image: '',
    description: '',
    dtype: 'domestic',
  });
  const [destError, setDestError] = useState('');
  const [destSuccess, setDestSuccess] = useState('');

  // State for viewing/editing destinations
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editDestination, setEditDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    image: '',
    description: '',
    dtype: '',
  });

  // Fetch destinations
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (successMessage || destSuccess) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setDestSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, destSuccess]);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/destinations');
      console.log('API Response:', response.data);
      setDestinations(response.data || []);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error('Fetch destinations error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(errorMessage || 'Failed to fetch destinations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a destination
  const handleDestinationChange = (e) => {
    setDestinationData({
      ...destinationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    setDestError('');
    setDestSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDestError('❌ Please sign in as an admin first.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/destinations', destinationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setDestSuccess('✅ Destination added successfully!');
        setDestinationData({ name: '', image: '', description: '', dtype: 'domestic' });
        fetchDestinations(); // Refresh destinations list
      } else {
        setDestError('❌ Error adding destination.');
      }
    } catch (err) {
      console.error('Axios Error:', err.response?.status, err.response?.data);
      setDestError(err.response?.data?.error || '❌ Error adding destination. Check console for details.');
    }
  };

  // Handle deleting a destination
  const deleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Destination deleted successfully!');
      setDestinations(destinations.filter((destination) => destination.did !== id));
      setError('');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || 'Failed to delete destination. Please try again.');
    }
  };

  // Handle editing a destination
  const handleEditClick = (destination) => {
    setEditDestination(destination);
    setUpdatedDetails({
      name: destination.name,
      image: destination.image,
      description: destination.description,
      dtype: destination.dtype,
    });
  };

  const handleUpdateDestination = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/destinations/${editDestination.did}`,
        updatedDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Destination updated successfully!');
      setEditDestination(null);
      fetchDestinations();
      setError('');
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || 'Failed to update destination.');
    }
  };

  // Filter destinations
  const filteredDestinations = filter === 'all'
    ? destinations
    : destinations.filter((dest) => dest.dtype === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Manage Destinations</h1>
          <p className="text-gray-600 mb-6">Add, view, edit, or delete destinations</p>
        </header>

        {/* Add Destination Form */}
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Destination</h2>
          {destError && <p className="text-red-500 text-center mb-2">{destError}</p>}
          {destSuccess && <p className="text-green-500 text-center mb-2 animate-pulse">{destSuccess}</p>}
          <form onSubmit={handleDestinationSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={destinationData.name}
              onChange={handleDestinationChange}
              placeholder="Destination Name"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="text"
              name="image"
              value={destinationData.image}
              onChange={handleDestinationChange}
              placeholder="Image URL"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
            <textarea
              name="description"
              value={destinationData.description}
              onChange={handleDestinationChange}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 h-32"
              required
            />
            <select
              name="dtype"
              value={destinationData.dtype}
              onChange={handleDestinationChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Add Destination
            </button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Destinations
          </button>
          <button
            onClick={() => setFilter('domestic')}
            className={`px-4 py-2 rounded-full transition ${
              filter === 'domestic' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Domestic
          </button>
          <button
            onClick={() => setFilter('international')}
            className={`px-4 py-2 rounded-full transition ${
              filter === 'international' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            International
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Destinations List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl">No destinations found</p>
            {filter !== 'all' && <p className="mt-2">Try changing your filter selection</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.did}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300')}
                  />
                  <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {destination.dtype === 'domestic' ? 'Domestic' : 'International'}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{destination.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      onClick={() => handleEditClick(destination)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      onClick={() => deleteDestination(destination.did)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editDestination && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
              <h3 className="text-2xl font-bold mb-6 text-indigo-800 border-b pb-2">Edit Destination</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Destination Name</label>
                  <input
                    type="text"
                    value={updatedDetails.name}
                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    placeholder="Enter destination name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Image URL</label>
                  <input
                    type="text"
                    value={updatedDetails.image}
                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, image: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Description</label>
                  <textarea
                    value={updatedDetails.description}
                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent h-32"
                    placeholder="Enter destination description"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Type</label>
                  <select
                    value={updatedDetails.dtype}
                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, dtype: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                  onClick={() => setEditDestination(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  className="flex items-center justify-center bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                  onClick={handleUpdateDestination}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDestinations;