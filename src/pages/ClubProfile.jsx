import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup"; // Import the popup
import "../styles/ClubProfile.css";
import api from "../utils/api"; // Import the API
import { Redirect } from 'react-router-dom'; // Use Redirect instead of Navigate

const ClubProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Check if user is authenticated
  const [showAuthPopup, setShowAuthPopup] = useState(!isAuthenticated); // Show popup if not authenticated
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [clubProfile, setClubProfile] = useState({
    clubName: "",
    country: "",
    internationalRosterSpots: "",
    headCoach: "",
    sportingDirector: "",
    clubContactName: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'club') {
      fetchClubProfile();
    }
  }, [isAuthenticated, user]);

  // Redirect players to player profile
  if (isAuthenticated && user?.role === 'player') {
    return <Redirect to="/playerProfile" />;
  }

  const fetchClubProfile = async () => {
    try {
      const response = await api.get('/clubProfiles/profile');
      setClubProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    if (loggedInUser.role === 'player') {
      return; // Do nothing as the redirect will happen
    }
    setShowAuthPopup(false); // Close popup upon successful login
    console.log("Logged in as:", loggedInUser); // Optional: Debug info
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClubProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const response = await api.put('/clubProfiles/profile', clubProfile);
      setClubProfile(response.data);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage('Error saving profile. Please try again.');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="club-profile-container">
      {showAuthPopup && (
        <AuthPopup onLoginSuccess={handleLoginSuccess} defaultRole="club" />
      )}

      {!showAuthPopup && (
        <>
          <h1>Club Profile</h1>

          <div className="club-profile-container">
            {/* Club Details Section */}
            <div className="club-details-section">
              <div className="field">
                <label>Club Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="clubName"
                    value={clubProfile.clubName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.clubName || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Country:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={clubProfile.country}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.country || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>International Roster Spots:</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="internationalRosterSpots"
                    value={clubProfile.internationalRosterSpots}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.internationalRosterSpots || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Head Coach:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="headCoach"
                    value={clubProfile.headCoach}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.headCoach || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Sporting Director:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="sportingDirector"
                    value={clubProfile.sportingDirector}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.sportingDirector || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Club Contact Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="clubContactName"
                    value={clubProfile.clubContactName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.clubContactName || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={clubProfile.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.email || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>WhatsApp:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="whatsapp"
                    value={clubProfile.whatsapp}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clubProfile.whatsapp || "Not provided"}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
            
            <button 
              onClick={handleEditToggle}
              disabled={isSaving}
              className={isEditing ? 'save-button' : 'edit-button'}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
            
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClubProfile;
