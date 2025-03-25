import React, { useState } from 'react';
import '../styles.css';
import axios from 'axios';

const AddDestination = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    dtype: 'domestic' // Default selection
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/destinations', formData);
      if (response.status === 201) {
        setSuccess('✅ Destination added successfully!');
        setFormData({ name: '', image: '', description: '', dtype: 'domestic' }); // Clear the form
      } else {
        setError('❌ Error adding destination.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Error adding destination. Check console for more details.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Destination</h2>
      
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Image URL:</label>
          <input 
            type="text" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description:</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            style={styles.textarea} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Type:</label>
          <select 
            name="dtype" 
            value={formData.dtype} 
            onChange={handleChange} 
            style={styles.select} 
            required
          >
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Add Destination</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '100px'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  button: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  success: {
    color: 'green',
    textAlign: 'center'
  }
};

export default AddDestination;
