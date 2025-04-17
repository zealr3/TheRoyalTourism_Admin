// src/components/AdminTourManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminTourManagement = () => {
  const [tours, setTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [newTour, setNewTour] = useState({
    tname: '',
    tday: '',
    tpickup: '',
    timg1: '',
    timg2: '',
    timg3: '',
    timg4: '',
    toverview: '',
    thighlights: '',
    package_id: '',
  });
  const [newItinerary, setNewItinerary] = useState({
    iname: '',
    iday1: '',
    iday2: '',
    iday3: '',
    iday4: '',
    iday5: '',
    iday6: '',
    iday7: '',
    tid: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTours();
    fetchPackages();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.get('http://localhost:5000/api/tours/details', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log('Tours fetched:', res.data);
      setTours(res.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error('Fetch tours error:', errorMessage);
      setError(errorMessage || 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      console.log('Packages fetched:', res.data);
      setPackages(res.data || []);
    } catch (err) {
      console.error('Fetch packages error:', err.response?.data || err.message);
    }
  };

  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { tname, tday, tpickup, timg1, timg2, timg3, timg4, toverview, thighlights, package_id } = newTour;
      console.log(`Adding tour with package_id: ${package_id}`);
      if (!tname || !tday || !tpickup || !timg1 || !timg2 || !timg3 || !timg4 || !toverview || !thighlights || !package_id) {
        setError('All tour fields are required');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token') || '';
      await axios.post(
        'http://localhost:5000/api/tours/details',
        { tname, tday: parseInt(tday), tpickup, timg1, timg2, timg3, timg4, toverview, thighlights, package_id: parseInt(package_id) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSuccess('Tour added successfully!');
      setNewTour({ tname: '', tday: '', tpickup: '', timg1: '', timg2: '', timg3: '', timg4: '', toverview: '', thighlights: '', package_id: '' });
      fetchTours();
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error('Add tour error:', errorMessage);
      setError(errorMessage || 'Failed to add tour');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { iname, iday1, iday2, iday3, iday4, iday5, iday6, iday7, tid } = newItinerary;
      console.log(`Adding itinerary with tid: ${tid}`);
      if (!iname || !tid) {
        setError('Itinerary name and tour selection are required');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token') || '';
      await axios.post(
        'http://localhost:5000/api/tours/itineraries',
        { iname, iday1, iday2, iday3, iday4, iday5, iday6, iday7, tid: parseInt(tid) },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSuccess('Itinerary added successfully!');
      setNewItinerary({ iname: '', iday1: '', iday2: '', iday3: '', iday4: '', iday5: '', iday6: '', iday7: '', tid: '' });
      fetchTours(); // Refresh tours to include updated itineraries
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      console.error('Add itinerary error:', errorMessage);
      setError(errorMessage || 'Failed to add itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Tours & Itineraries</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">{success}</div>
        )}

        {/* Tour Form */}
        <form onSubmit={handleAddTour} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tour Name"
              value={newTour.tname}
              onChange={(e) => setNewTour({ ...newTour, tname: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Days"
              value={newTour.tday}
              onChange={(e) => setNewTour({ ...newTour, tday: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Pickup Location"
              value={newTour.tpickup}
              onChange={(e) => setNewTour({ ...newTour, tpickup: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image 1 URL"
              value={newTour.timg1}
              onChange={(e) => setNewTour({ ...newTour, timg1: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image 2 URL"
              value={newTour.timg2}
              onChange={(e) => setNewTour({ ...newTour, timg2: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image 3 URL"
              value={newTour.timg3}
              onChange={(e) => setNewTour({ ...newTour, timg3: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image 4 URL"
              value={newTour.timg4}
              onChange={(e) => setNewTour({ ...newTour, timg4: e.target.value })}
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Overview"
              value={newTour.toverview}
              onChange={(e) => setNewTour({ ...newTour, toverview: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Highlights"
              value={newTour.thighlights}
              onChange={(e) => setNewTour({ ...newTour, thighlights: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <select
              value={newTour.package_id}
              onChange={(e) => setNewTour({ ...newTour, package_id: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Tour'}
          </button>
        </form>

        {/* Itinerary Form */}
        <form onSubmit={handleAddItinerary} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Itinerary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Itinerary Name"
              value={newItinerary.iname}
              onChange={(e) => setNewItinerary({ ...newItinerary, iname: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newItinerary.tid}
              onChange={(e) => setNewItinerary({ ...newItinerary, tid: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Tour</option>
              {tours.map((tour) => (
                <option key={tour.tid} value={tour.tid}>{tour.tname}</option>
              ))}
            </select>
            <textarea
              placeholder="Day 1"
              value={newItinerary.iday1}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday1: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 2"
              value={newItinerary.iday2}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday2: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 3"
              value={newItinerary.iday3}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday3: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 4"
              value={newItinerary.iday4}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday4: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 5"
              value={newItinerary.iday5}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday5: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 6"
              value={newItinerary.iday6}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday6: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Day 7"
              value={newItinerary.iday7}
              onChange={(e) => setNewItinerary({ ...newItinerary, iday7: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Itinerary'}
          </button>
        </form>

        {/* Existing Tours Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Tours</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tours.length === 0 ? (
            <p>No tours found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Days</th>
                  <th className="border p-2">Pickup</th>
                  <th className="border p-2">Package</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour.tid}>
                    <td className="border p-2">{tour.tname}</td>
                    <td className="border p-2">{tour.tday}</td>
                    <td className="border p-2">{tour.tpickup}</td>
                    <td className="border p-2">{tour.package_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTourManagement;