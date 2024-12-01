import React, { useState } from 'react';
import PlayerSignUp from './PlayerSignUp';

const ClubSignUp = ({ onClose }) => {
  const [formData, setFormData] = useState({
    clubName: '',
    location: '',
    contact: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Club Profile:', formData);
    alert('Club profile submitted successfully!');
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Club Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Club Name:
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contact Info:
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  ...PlayerSignUp.styles, // Reuse styles from PlayerSignUp
};

export default ClubSignUp;
