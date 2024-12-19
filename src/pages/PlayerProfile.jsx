import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from '../utils/api';
import AuthPopup from "../components/AuthPopup"; 
import Select from "react-select";
import "../styles/PlayerProfile.css";
import { BIRTH_YEARS, POSITIONS, COUNTRIES, AVAILABILITY, PRO_EXPERIENCE } from "../constants/dropdownOptions";
import { Redirect } from 'react-router-dom'; // Use Redirect instead of Navigate

const countriesOptions = COUNTRIES.map((country) => ({ value: country, label: country }));
const positionsOptions = POSITIONS.map((position) => ({ value: position, label: position }));
const birthYearOptions = BIRTH_YEARS.map((year) => ({ value: year, label: year }));
const availabilityOptions = AVAILABILITY.map((avail) => ({ value: avail, label: avail }));
const proExperienceOptions = PRO_EXPERIENCE.map((exp) => ({ value: exp, label: exp }));

const FileInput = ({ type, currentFile, currentFileName, onChange, onRemove }) => {
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
        {currentFile ? "File selected" : "Choose file"}
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
    profileImageName: "",
    playerName: "",
    birthYear: "",
    positions: [],
    availability: "",
    citizenship: [],
    proExperience: "",
    highlightVideo: "",
    fullMatchVideo: "",
    playerCV: null,
    playerCVName: "",
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
    return <Redirect to="/clubProfile" />;
  }

  const handleFileRemove = async (fileType) => {
    try {
      const response = await api.put('/playerProfiles/profile', { [fileType]: null });
      setProfile(prev => ({
        ...prev,
        [fileType]: null
      }));
      setMessage(`${fileType === 'profileImage' ? 'Profile picture' : 'CV'} removed`);
    } catch (error) {
      setMessage(`Error removing ${fileType === 'profileImage' ? 'profile picture' : 'CV'}. Please try again.`);
      console.error('Remove error:', error);
    }
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (file.size > 5 * 1024 * 1024) { // Check if file size exceeds 5MB
      setMessage('File size too large. Maximum size is 5MB.');
      return;
    }
  
    const formData = new FormData();
    formData.append(fileType, file);
  
    try {
      const response = await api.put('/playerProfiles/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setProfile(prev => ({
        ...prev,
        [fileType]: response.data[fileType] // Update state with the new file data
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
      const response = await api.put('/playerProfiles/profile', {
        ...profile,
        positions: JSON.stringify(profile.positions),
        citizenship: JSON.stringify(profile.citizenship),
        profileImage: profile.profileImage,
        playerCV: profile.playerCV,
      });

      if (response.data) {
        setProfile(response.data); // Update profile state with response data
      }
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
  const getImageUrl = (profileImageBase64) => {
    if (!profileImageBase64) return "/profilepic.jpg";
    return `data:image/jpeg;base64,${profileImageBase64}`;
  };

  // Update CV display
  const getCVLink = (playerCVBase64) => {
    if (!playerCVBase64) return "";
    return `data:application/pdf;base64,${playerCVBase64}`;
  };

  const handleDownloadCV = async () => {
    try {
      const response = await api.get('/playerProfiles/profile/downloadCV', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'playerCV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage('Error downloading CV. Please try again.');
      console.error('Download error:', error);
    }
  };

  const isExternalLink = (url) => {
    const herokuDomain = 'https://playrportal-backend-7b03af3bdfa6.herokuapp.com';
    return url && !url.startsWith(herokuDomain);
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
                    e.target.src = "/profilepic.jpg";
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
                    value={positionsOptions.filter(option => profile.positions.includes(option.value))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                      setProfile((prev) => ({ ...prev, positions: values }));
                    }}
                  />
                ) : (
                  <span>{Array.isArray(profile.positions) ? profile.positions.join(", ") : ""}</span>
                )}
              </div>

              <div className="field">
                <label>Citizenship:</label>
                {isEditing ? (
                  <Select
                    isMulti
                    name="citizenship"
                    options={countriesOptions}
                    value={countriesOptions.filter(option => profile.citizenship.includes(option.value))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                      setProfile((prev) => ({ ...prev, citizenship: values }));
                    }}
                  />
                ) : (
                  <span>{Array.isArray(profile.citizenship) ? profile.citizenship.join(", ") : ""}</span>
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
                  <span>{profile.highlightVideo || ""}</span>
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
                  <span>{profile.fullMatchVideo || ""}</span>
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
                  profile.playerCV ? (
                    <span>CV Uploaded</span>
                  ) : (
                    <span>No CV Uploaded</span>
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