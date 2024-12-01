import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup"; // Import the popup
import "../styles/ClubProfile.css";

const ClubProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Check if user is authenticated
  const [showAuthPopup, setShowAuthPopup] = useState(!isAuthenticated); // Show popup if not authenticated
  const [isEditing, setIsEditing] = useState(false);

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

  const handleLoginSuccess = (loggedInUser) => {
    setShowAuthPopup(false); // Close popup upon successful login
    console.log("Logged in as:", loggedInUser); // Optional: Debug info
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClubProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save data (e.g., API call)
  };

  return (
    
    <div className="club-profile">
      {showAuthPopup && (
        <AuthPopup onLoginSuccess={handleLoginSuccess} />
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

          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </>
      )}
    </div>
  );
};

export default ClubProfile;
