import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTourManagement = () => {
  const [tours, setTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const res = await axios.get('http://localhost:5000/api/tours/details/0', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTours(res.data || []);
    } catch (err) {
      console.error('Fetch error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      console.log('Packages:', res.data);
      setPackages(res.data || []);
    } catch (err) {
      console.error('Packages error:', err.response || err);
      setError('Failed to load packages');
    }
  };

  const handleTourInputChange = (e) => {
    setNewTour({ ...newTour, [e.target.name]: e.target.value });
  };

  const handleItineraryInputChange = (e) => {
    setNewItinerary({ ...newItinerary, [e.target.name]: e.target.value });
  };

  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { tname, tday, tpickup, timg1, timg2, timg3, timg4, toverview, thighlights, package_id } = newTour;
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
      console.error('Add tour error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to add tour');
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
      if (!iname || !tid) {
        setError('Name and tour ID are required');
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
      fetchTours();
    } catch (err) {
      console.error('Add itinerary error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to add itinerary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchTours();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Tour Management</h1>

      {/* Add Tour Form */}
      <div className="w-full max-w-lg mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Tour</h2>
          {success && (
            <p className="text-green-600 bg-green-100 p-3 rounded-md mb-6">{success}</p>
          )}
          {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-md mb-6">{error}</p>
          )}
          <form onSubmit={handleAddTour}>
            <div className="space-y-6">
              <div>
                <label htmlFor="tname" className="block text-sm font-medium text-gray-700 mb-1">
                  Tour Name
                </label>
                <input
                  type="text"
                  id="tname"
                  name="tname"
                  value={newTour.tname}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tour name"
                />
              </div>
              <div>
                <label htmlFor="tday" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  id="tday"
                  name="tday"
                  value={newTour.tday}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of days"
                />
              </div>
              <div>
                <label htmlFor="tpickup" className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="tpickup"
                  name="tpickup"
                  value={newTour.tpickup}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter pickup location"
                />
              </div>
              <div>
                <label htmlFor="timg1" className="block text-sm font-medium text-gray-700 mb-1">
                  Image 1 URL
                </label>
                <input
                  type="text"
                  id="timg1"
                  name="timg1"
                  value={newTour.timg1}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label htmlFor="timg2" className="block text-sm font-medium text-gray-700 mb-1">
                  Image 2 URL
                </label>
                <input
                  type="text"
                  id="timg2"
                  name="timg2"
                  value={newTour.timg2}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label htmlFor="timg3" className="block text-sm font-medium text-gray-700 mb-1">
                  Image 3 URL
                </label>
                <input
                  type="text"
                  id="timg3"
                  name="timg3"
                  value={newTour.timg3}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label htmlFor="timg4" className="block text-sm font-medium text-gray-700 mb-1">
                  Image 4 URL
                </label>
                <input
                  type="text"
                  id="timg4"
                  name="timg4"
                  value={newTour.timg4}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label htmlFor="toverview" className="block text-sm font-medium text-gray-700 mb-1">
                  Overview
                </label>
                <textarea
                  id="toverview"
                  name="toverview"
                  value={newTour.toverview}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tour overview"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="thighlights" className="block text-sm font-medium text-gray-700 mb-1">
                  Highlights
                </label>
                <textarea
                  id="thighlights"
                  name="thighlights"
                  value={newTour.thighlights}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tour highlights"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="package_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Package
                </label>
                <select
                  id="package_id"
                  name="package_id"
                  value={newTour.package_id}
                  onChange={handleTourInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {loading ? 'Adding...' : 'Add Tour'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Itinerary Form */}
      <div className="w-full max-w-lg mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Itinerary</h2>
          <form onSubmit={handleAddItinerary}>
            <div className="space-y-6">
              <div>
                <label htmlFor="iname" className="block text-sm font-medium text-gray-700 mb-1">
                  Itinerary Name
                </label>
                <input
                  type="text"
                  id="iname"
                  name="iname"
                  value={newItinerary.iname}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter itinerary name"
                />
              </div>
              <div>
                <label htmlFor="iday1" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 1
                </label>
                <textarea
                  id="iday1"
                  name="iday1"
                  value={newItinerary.iday1}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 1 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday2" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 2
                </label>
                <textarea
                  id="iday2"
                  name="iday2"
                  value={newItinerary.iday2}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 2 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday3" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 3
                </label>
                <textarea
                  id="iday3"
                  name="iday3"
                  value={newItinerary.iday3}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 3 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday4" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 4
                </label>
                <textarea
                  id="iday4"
                  name="iday4"
                  value={newItinerary.iday4}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 4 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday5" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 5
                </label>
                <textarea
                  id="iday5"
                  name="iday5"
                  value={newItinerary.iday5}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 5 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday6" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 6
                </label>
                <textarea
                  id="iday6"
                  name="iday6"
                  value={newItinerary.iday6}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 6 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="iday7" className="block text-sm font-medium text-gray-700 mb-1">
                  Day 7
                </label>
                <textarea
                  id="iday7"
                  name="iday7"
                  value={newItinerary.iday7}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Day 7 plan"
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="tid" className="block text-sm font-medium text-gray-700 mb-1">
                  Tour
                </label>
                <select
                  id="tid"
                  name="tid"
                  value={newItinerary.tid}
                  onChange={handleItineraryInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a tour</option>
                  {tours.map((t) => (
                    <option key={t.tid} value={t.tid}>
                      {t.tname}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {loading ? 'Adding...' : 'Add Itinerary'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tours and Itineraries Table */}
      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-xs">
                  <th className="py-4 px-6 text-left">Tour ID</th>
                  <th className="py-4 px-6 text-left">Tour Name</th>
                  <th className="py-4 px-6 text-left">Duration</th>
                  <th className="py-4 px-6 text-left">Pickup</th>
                  <th className="py-4 px-6 text-left">Itinerary Name</th>
                  <th className="py-4 px-6 text-left">Days</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 px-6 text-center text-gray-500">
                      No tours found
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <React.Fragment key={tour.tid}>
                      <tr className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">{tour.tid}</td>
                        <td className="py-4 px-6">{tour.tname}</td>
                        <td className="py-4 px-6">{tour.tday} days</td>
                        <td className="py-4 px-6">{tour.tpickup}</td>
                        <td className="py-4 px-6">-</td>
                        <td className="py-4 px-6">-</td>
                      </tr>
                      {tour.itineraries && tour.itineraries.map((itinerary) => (
                        <tr key={itinerary.iid} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6"></td>
                          <td className="py-4 px-6"></td>
                          <td className="py-4 px-6"></td>
                          <td className="py-4 px-6"></td>
                          <td className="py-4 px-6">{itinerary.iname}</td>
                          <td className="py-4 px-6">
                            {[1, 2, 3, 4, 5, 6, 7].filter(day => itinerary[`iday${day}`]).length} days
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
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

export default AdminTourManagement;