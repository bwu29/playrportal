import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup"; 
import Select from "react-select";
import "../styles/PlayerProfile.css";
import { BIRTH_YEARS, POSITIONS, COUNTRIES, AVAILABILITY, PRO_EXPERIENCE } from "../constants/dropdownOptions";

const countriesOptions = COUNTRIES.map((country) => ({ value: country, label: country }));
const positionsOptions = POSITIONS.map((position) => ({ value: position, label: position }));
const birthYearOptions = BIRTH_YEARS.map((year) => ({ value: year, label: year }));
const availabilityOptions = AVAILABILITY.map((avail) => ({ value: avail, label: avail }));
const proExperienceOptions = PRO_EXPERIENCE.map((exp) => ({ value: exp, label: exp }));



const PlayerProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Check if user is authenticated
  const [showAuthPopup, setShowAuthPopup] = useState(!isAuthenticated); // Show popup if not authenticated
  const [isEditing, setIsEditing] = useState(false);

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
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profileImage: reader.result, // Save the image as base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setShowAuthPopup(false); // Close popup upon successful login
    console.log("Logged in as:", loggedInUser); // Optional: Debug info
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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
                <img src = "profilepic.jpg" alt = "Placeholder" />
              )}
            </div>

            {isEditing && (
               
               <input type="file" accept="image/*" onChange={handleFileChange} />
           
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
                  <input type="file" onChange={handleFileChange} />
                  
                ) : (
                  <span>
                    {profile.playerCV ? profile.playerCV.name : ""}
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

        
        

          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </>
      )}
    </div>
  );
};

export default PlayerProfile;
