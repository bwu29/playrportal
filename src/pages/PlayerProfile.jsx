import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from '../utils/api';
import AuthPopup from "../components/AuthPopup"; 
import Select from "react-select";
import "../styles/PlayerProfile.css";
import { BIRTH_YEARS, POSITIONS, COUNTRIES, AVAILABILITY, PRO_EXPERIENCE } from "../constants/dropdownOptions";
import { Navigate } from 'react-router-dom';

const countriesOptions = COUNTRIES.map((country) => ({ value: country, label: country }));
const positionsOptions = POSITIONS.map((position) => ({ value: position, label: position }));
const birthYearOptions = BIRTH_YEARS.map((year) => ({ value: year, label: year }));
const availabilityOptions = AVAILABILITY.map((avail) => ({ value: avail, label: avail }));
const proExperienceOptions = PRO_EXPERIENCE.map((exp) => ({ value: exp, label: exp }));

const FileInput = ({ type, currentFile, onChange, onRemove }) => {
  const inputRef = React.useRef(null);
  const fileTypes = {
    profileImage: "image/jpeg, image/png",
    playerCV: ".pdf"
  };
  
  return (
    <div className="file-input-container">
      <input
        ref={inputRef}
        type="file"
        accept={fileTypes[type]}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <label className="file-label" onClick={() => inputRef.current.click()}>
        {currentFile?.fileName || "Choose file"}
      </label>
      {currentFile && 
        <span 
          className="remove-file" 
          onClick={onRemove}
          title="Remove file"
        >
          ×
        </span>
      }
    </div>
  );
};

const PlayerProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Check if user is authenticated
  const [showAuthPopup, setShowAuthPopup] = useState(!isAuthenticated); // Show popup if not authenticated
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    profileImage: "",
    playerName: "",
    birthYear: "",
    positions: [],
    availability: "",
    citizenship: [],
    proExperience: "",
    highlightVideo: "",
    fullMatchVideo: "",
    playerCV: null,
    email: "",
    whatsapp: "",
    agentEmail: "",
  });

  // Define fetchPlayerProfile before using it in useEffect
  const fetchPlayerProfile = async () => {
    try {
      const response = await api.get('/playerProfiles/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayerProfile();
    }
  }, [isAuthenticated]);

  // Redirect clubs to club profile
  if (isAuthenticated && user?.role === 'club') {
    return <Navigate to="/clubProfile" replace />;
  }

  const handleFileRemove = (fileType) => {
    setProfile(prev => ({
      ...prev,
      [fileType]: null
    }));
    setMessage(`${fileType === 'profileImage' ? 'Profile picture' : 'CV'} removed`);
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(fileType, file);
    formData.append('action', 'update'); // Indicate this is a file update

    try {
      const response = await api.put('/playerProfiles/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(prev => ({
        ...prev,
        [fileType]: response.data[fileType]
      }));
      
      setMessage(`${fileType === 'profileImage' ? 'Profile picture' : 'CV'} updated successfully!`);
    } catch (error) {
      setMessage(`Error uploading ${fileType === 'profileImage' ? 'profile picture' : 'CV'}. Please try again.`);
      console.error('Upload error:', error);
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    if (loggedInUser.role === 'club') {
      return; // Do nothing as the redirect will happen
    }
    setShowAuthPopup(false); // Close popup upon successful login
    console.log("Logged in as:", loggedInUser); // Optional: Debug info
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // If we're currently editing, clicking means we want to save
      await handleSave();
    } else {
      // If we're not editing, just enter edit mode
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== 'profileImage' && key !== 'playerCV') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      });

      // Log the form data for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.put('/playerProfiles/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(response.data);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (error) {
      console.error('Save error:', error.response?.data || error);
      setMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add function to get image URL
  const getImageUrl = (profileImage) => {
    if (!profileImage) return "profilepic.jpg";
    if (typeof profileImage === 'object' && profileImage.fileName) {
      return `${api.defaults.baseURL}/playerProfiles/profile/image/${profile._id}`;
    }
    return "profilepic.jpg";
  };

  // Update CV display
  const getCVLink = () => {
    if (profile._id && profile.playerCV) {
      return `${api.defaults.baseURL}/playerProfiles/profile/cv/${profile._id}`;
    }
    return null;
  };

  return (
    <div className={`player-profile ${showAuthPopup ? "popup-visible" : ""}`}>
      {showAuthPopup && (
        <div className="popup-overlay">
          <AuthPopup onLoginSuccess={handleLoginSuccess} defaultRole="player" />
        </div>
      )}

      {!showAuthPopup && (
        <>
          <div className="profile-header">
            <h2>Increase your visibility, allowing clubs to search by profile</h2>
          </div>

          <div className="profile-container">
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-picture">
                <img 
                  src={getImageUrl(profile.profileImage)} 
                  alt="Profile" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "profilepic.jpg";
                  }}
                />
              </div>
              {isEditing && (
                <div className="file-input-wrapper">
                  <FileInput
                    type="profileImage"
                    currentFile={profile.profileImage}
                    onChange={(e) => handleFileChange(e, 'profileImage')}
                    onRemove={() => handleFileRemove('profileImage')}
                  />
                </div>
              )}
            </div>
            {/* Profile Details Section */}
            <div className="profile-details-section">
              <div className="field">
                <label>Player Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="playerName"
                    value={profile.playerName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{profile.playerName || ""}</span>
                )}
              </div>
              <div className="field">
                <label>Birth Year:</label>
                {isEditing ? (
                  <Select
                    options={birthYearOptions}
                    value={birthYearOptions.find((option) => option.value === profile.birthYear)}
                    onChange={(selected) =>
                      setProfile({ ...profile, birthYear: selected ? selected.value : "" })
                    }
                  />
                ) : (
                  <span>{profile.birthYear || ""}</span>
                )}
              </div>

              <div className="field">
                <label>Positions:</label>
                {isEditing ? (
                  <Select
                    isMulti
                    name="positions"
                    options={positionsOptions}
                    value={profile.positions.map((pos) => ({ value: pos, label: pos }))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                      setProfile((prev) => ({ ...prev, positions: values }));
                    }}
                  />
                ) : (
                  <span>{profile.positions.join(", ") || ""}</span>
                )}
              </div>

              <div className="field">
                <label>Citizenship:</label>
                {isEditing ? (
                  <Select
                    isMulti
                    name="citizenship"
                    options={countriesOptions}
                    value={profile.citizenship.map((cit) => ({ value: cit, label: cit }))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                      setProfile((prev) => ({ ...prev, citizenship: values }));
                    }}
                  />
                ) : (
                  <span>{profile.citizenship.join(", ") || ""}</span>
                )}
              </div>

              <div className="field">
                <label>Availability:</label>
                {isEditing ? (
                  <Select
                    options={availabilityOptions}
                    value={availabilityOptions.find((opt) => opt.value === profile.availability)}
                    onChange={(selected) =>
                      setProfile({ ...profile, availability: selected ? selected.value : "" })
                    }
                  />
                ) : (
                  <span>{profile.availability || ""}</span>
                )}
              </div>

              <div className="field">
                <label>Pro Experience:</label>
                {isEditing ? (
                  <Select
                    options={proExperienceOptions}
                    value={proExperienceOptions.find(
                      (opt) => opt.value === profile.proExperience
                    )}
                    onChange={(selected) =>
                      setProfile({ ...profile, proExperience: selected ? selected.value : "" })
                    }
                  />
                ) : (
                  <span>{profile.proExperience || ""}</span>
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
                    {profile.highlightVideo || ""}
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
                    {profile.fullMatchVideo || ""}
                  </a>
                )}
              </div>

              <div className="field">
                <label>Player CV:</label>
                {isEditing ? (
                  <div className="file-input-wrapper">
                    <FileInput
                      type="playerCV"
                      currentFile={profile.playerCV}
                      onChange={(e) => handleFileChange(e, 'playerCV')}
                      onRemove={() => handleFileRemove('playerCV')}
                    />
                  </div>
                ) : (
                  profile.playerCV?.fileName ? (
                    <a 
                      href={`${api.defaults.baseURL}/playerProfiles/profile/cv/${profile._id}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {profile.playerCV.fileName}
                    </a>
                  ) : (
                    <span>No CV uploaded</span>
                  )
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
                  <span>{profile.email || ""}</span>
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
                  <span>{profile.whatsapp || ""}</span>
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
                  <span>{profile.agentEmail || ""}</span>
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
                style={{ marginLeft: '10px' }}
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

export default PlayerProfile;
