import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup"; // Import the popup
import "../styles/PlayerProfile.css";

const PlayerProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Check if user is authenticated
  const [showAuthPopup, setShowAuthPopup] = useState(!isAuthenticated); // Show popup if not authenticated
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    profileImage: "",
    birthYear: "",
    positions: "",
    availability: "",
    citizenship: "",
    proExperience: "",
    highlightVideo: "",
    fullMatchVideo: "",
    playerCV: null,
    email: "",
    whatsapp: "",
    agentEmail: "",
  });

  const handleLoginSuccess = (loggedInUser) => {
    setShowAuthPopup(false); // Close popup upon successful login
    console.log("Logged in as:", loggedInUser); // Optional: Debug info
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile((prev) => ({ ...prev, playerCV: e.target.files[0] }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save data (e.g., API call)
  };

  return (
    <div className={`player-profile ${showAuthPopup ? "popup-visible" : ""}`}>
      {showAuthPopup && (
        <div className="popup-overlay">
          <AuthPopup onLoginSuccess={handleLoginSuccess} />
        </div>
      )}

      {!showAuthPopup && (
        <>
          <h1>Player Profile</h1>

          <div className="profile-container">
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-picture">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" />
                ) : (
                  <div className="placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <input
                  type="text"
                  name="profileImage"
                  placeholder="Image URL"
                  value={profile.profileImage}
                  onChange={handleInputChange}
                />
              )}
            </div>

            {/* Profile Details Section */}
        
              <div className="profile-details-section">
              <div className="field">
                <label>Birth Year:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="birthYear"
                    value={profile.birthYear}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.birthYear || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Positions:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="positions"
                    value={profile.positions}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.positions || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Availability:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="availability"
                    value={profile.availability}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.availability || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Citizenship:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="citizenship"
                    value={profile.citizenship}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.citizenship || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Years of Pro Experience:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="proExperience"
                    value={profile.proExperience}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.proExperience || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Highlight Video:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="highlightVideo"
                    value={profile.highlightVideo}
                    onChange={handleInputChange}
                  />
                ) : (
                  <a
                    href={profile.highlightVideo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.highlightVideo || "Not provided"}
                  </a>
                )}
              </div>

              <div className="field">
                <label>Full Match Video:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullMatchVideo"
                    value={profile.fullMatchVideo}
                    onChange={handleInputChange}
                  />
                ) : (
                  <a
                    href={profile.fullMatchVideo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.fullMatchVideo || "Not provided"}
                  </a>
                )}
              </div>

              <div className="field">
                <label>Player CV:</label>
                {isEditing ? (
                  <input type="file" onChange={handleFileChange} />
                ) : (
                  <span>
                    {profile.playerCV ? profile.playerCV.name : "Not uploaded"}
                  </span>
                )}
              </div>

              <div className="field">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.email || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>WhatsApp:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="whatsapp"
                    value={profile.whatsapp}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.whatsapp || "Not provided"}</span>
                )}
              </div>

              <div className="field">
                <label>Agent Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="agentEmail"
                    value={profile.agentEmail}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.agentEmail || "Not provided"}</span>
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

export default PlayerProfile;
