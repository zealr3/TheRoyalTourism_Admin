import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePackages = () => {
  // State for adding packages
  const [packageData, setPackageData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    destinationId: '',
  });
  const [destinations, setDestinations] = useState([]);
  const [pkgError, setPkgError] = useState('');
  const [pkgSuccess, setPkgSuccess] = useState('');

  // State for viewing/editing/deleting packages
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState(null);

  // Fetch destinations and packages on mount
  useEffect(() => {
    fetchDestinations();
    fetchPackages();
  }, []);

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (success || pkgSuccess) {
      const timer = setTimeout(() => {
        setSuccess('');
        setPkgSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, pkgSuccess]);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      console.log('Fetched destinations:', res.data);
      setDestinations(res.data || []);
    } catch (err) {
      console.error('Failed to load destinations:', err);
      setError('Failed to load destinations. Please try again.');
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      console.log('Fetched packages:', res.data);
      setPackages(res.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load packages:', err);
      setError('Failed to load packages. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a package
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPkgError('');
    setPkgSuccess('');

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      console.log('Submitting package:', packageData);
      const response = await axios.post(
        'http://localhost:5000/api/packages/',
        { ...packageData, price: parseFloat(packageData.price), destinationId: Number(packageData.destinationId) },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setPkgSuccess('✅ Package added successfully!');
        setPackageData({
          name: '',
          price: '',
          description: '',
          image: '',
          destinationId: '',
        });
        fetchPackages(); // Refresh packages list
      }
    } catch (error) {
      console.error('Error adding package:', error.response?.data || error.message);
      setPkgError(
        error.response?.data?.message || error.response?.data?.error || error.message || '❌ Error adding package.'
      );
    }
  };

  // Handle deleting a package
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete packages');
        return;
      }

      console.log('Deleting package with ID:', id);
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      setSuccess('Package deleted successfully!');
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('You are not authorized to delete packages');
        } else if (err.response.status === 404) {
          setError('Package not found. It may have been already deleted.');
          fetchPackages();
        } else {
          setError(`Failed to delete package: ${err.response.data?.error || err.response.statusText}`);
        }
      } else if (err.request) {
        setError('Server is not responding. Please try again later.');
      } else {
        setError(`Failed to delete package: ${err.message}`);
      }
    }
  };

  // Handle editing a package
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit packages');
        return;
      }

      console.log('Updating package:', editData);
      await axios.put(
        `http://localhost:5000/api/packages/${editData.id}`,
        {
          ...editData,
          price: parseFloat(editData.price),
          destinationId: parseInt(editData.destinationId, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Package updated successfully!');
      setEditData(null);
      fetchPackages();
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('You are not authorized to edit packages');
        } else if (err.response.status === 404) {
          setError('Package not found. It may have been deleted.');
          fetchPackages();
        } else {
          setError(`Failed to update package: ${err.response.data?.error || err.response.statusText}`);
        }
      } else if (err.request) {
        setError('Server is not responding. Please try again later.');
      } else {
        setError(`Failed to update package: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Manage Packages</h1>
          <p className="text-gray-600 mb-6">Add, view, edit, or delete travel packages</p>
        </header>

        {/* Add Package Form */}
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Package</h2>
          {pkgError && <p className="text-red-500 text-center mb-2">{pkgError}</p>}
          {pkgSuccess && <p className="text-green-500 text-center mb-2 animate-pulse">{pkgSuccess}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={packageData.name}
              onChange={handleChange}
              placeholder="Package Name"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="number"
              name="price"
              value={packageData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
            <textarea
              name="description"
              value={packageData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 h-32"
              required
            />
            <input
              type="text"
              name="image"
              value={packageData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
            {packageData.image && (
              <img
                src={packageData.image}
                alt="Preview"
                className="w-full h-40 object-cover mt-2 rounded-md"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300')}
              />
            )}
            <select
              name="destinationId"
              value={packageData.destinationId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Select Destination</option>
              {destinations.length > 0 ? (
                destinations.map((dest) => (
                  <option key={dest.did} value={dest.did}>
                    {dest.name}
                  </option>
                ))
              ) : (
                <option disabled>No destinations available</option>
              )}
            </select>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
              Add Package
            </button>
          </form>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
            {error}
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
              <span className="text-xl">×</span>
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md animate-pulse">
            {success}
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccess('')}>
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* Packages List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl">No packages found. Add some packages to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300')}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4 flex-1 line-clamp-2">{pkg.description}</p>
                  <p className="font-semibold text-lg text-indigo-600">₹ {pkg.price}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Destination: {pkg.destination?.name || 'Unknown'}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <button
                      className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      onClick={() => setEditData(pkg)}
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
                      onClick={() => handleDelete(pkg.id)}
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
        {editData && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
              <h3 className="text-2xl font-bold mb-6 text-indigo-800 border-b pb-2">Edit Package</h3>
              <div className="space-y-4">
                {['name', 'price', 'description', 'image', 'destinationId'].map((field) => (
                  <div key={field}>
                    <label className="block text-gray-700 mb-1 font-medium capitalize">{field}</label>
                    {field === 'destinationId' ? (
                      <select
                        name="destinationId"
                        value={editData.destinationId || ''}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      >
                        <option value="">Select Destination</option>
                        {destinations.map((dest) => (
                          <option key={dest.did} value={dest.did}>
                            {dest.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field}
                        value={editData[field] || ''}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        type={field === 'price' ? 'number' : 'text'}
                        placeholder={`Enter ${field}`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                  onClick={() => setEditData(null)}
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
                  onClick={handleEditSave}
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

export default ManagePackages;