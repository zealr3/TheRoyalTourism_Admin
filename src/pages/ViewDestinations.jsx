import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        setDestinations(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch destinations. Please try again later.');
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div>
      <h2>All Destinations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {destinations.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {destinations.map(destination => (
            <div 
              key={destination.did} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                textAlign: 'center'
              }}
            >
              <h3>{destination.name} ({destination.dtype})</h3>
              <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
              <img 
  src={destination.image} 
  alt={destination.name} 
  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }} 
  onError={(e) => e.target.src = 'https://via.placeholder.com/200'}  // If the image fails to load
/>

              </div>
              <p>{destination.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No destinations found.</p>
      )}
    </div>
  );
};

export default ViewDestinations;
