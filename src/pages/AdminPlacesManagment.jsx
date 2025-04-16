/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPlaceManagement = () => {
  const [places, setPlaces] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDid, setSelectedDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPlace, setNewPlace] = useState({ pdetail: '', pimg: '', did: '' });

  const fetchPlaces = async (did = '') => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      const url = did
        ? `http://localhost:5000/api/places/list?did=${did}`
        : 'http://localhost:5000/api/places/list';

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPlaces(res.data.places || res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch place data');
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
    fetchPlaces(did);
  };

  const handleInputChange = (e) => {
    setNewPlace({ ...newPlace, [e.target.name]: e.target.value });
  };

  const handleAddPlace = async () => {
    try {
      if (!newPlace.pdetail || !newPlace.pimg || !newPlace.did) {
        setError('All fields are required');
        return;
      }
      await axios.post('http://localhost:5000/api/places', newPlace);
      fetchPlaces(selectedDid);
      setNewPlace({ pdetail: '', pimg: '', did: '' });
    } catch (err) {
      setError('Error adding place');
    }
  };

  useEffect(() => {
    fetchDestinations();
    fetchPlaces();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Place Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Place</h2>
        <input name="pdetail" value={newPlace.pdetail} onChange={handleInputChange} placeholder="Place detail" className="input mb-2" />
        <input name="pimg" value={newPlace.pimg} onChange={handleInputChange} placeholder="Image URL" className="input mb-2" />
        <select name="did" value={newPlace.did} onChange={handleInputChange} className="input mb-4">
          <option value="">Select Destination</option>
          {destinations.map((d) => (
            <option key={d.did} value={d.did}>{d.name}</option>
          ))}
        </select>
        <button onClick={handleAddPlace} className="bg-green-600 text-white px-4 py-2 rounded">Add Place</button>
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
              <th>Place Detail</th>
              <th>Image</th>
              <th>Destination ID</th>
            </tr>
          </thead>
          <tbody>
            {places.length === 0 ? (
              <tr><td colSpan="4">No place found</td></tr>
            ) : (
              places.map((p) => (
                <tr key={p.pid}>
                  <td>{p.pid}</td>
                  <td>{p.pdetail}</td>
                  <td>
                    <img src={p.pimg} alt={p.pdetail} className="h-16 w-16" />
                  </td>
                  <td>{p.did}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPlaceManagement;
