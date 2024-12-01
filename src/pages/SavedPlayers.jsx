import React, { useState, useEffect } from "react";
import mockPlayersData from "../mock/savedplayers.json";
import "../styles/SearchPlayers.css";

const SavedPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [availability, setAvailability] = useState("");
  const [proExperience, setProExperience] = useState("");
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPlayer, setPopupPlayer] = useState(null);
  const [viewedDetailsPlayer, setViewedDetailsPlayer] = useState(null);

  const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Burkina Faso", 
    "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", 
    "Chad", "Chile", "China PR", "Chinese Taipei", "Colombia", "Comoros", "Congo", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "DR Congo", "Denmark", 
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", 
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", 
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Haiti", "Honduras", 
    "Hong Kong", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", 
    "Kyrgyz Republic", "Latvia", "Lebanon", "Liberia", "Libya", "Liechtenstein", 
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
    "Malta", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Morocco", 
    "Mozambique", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
    "Niger", "Nigeria", "North Macedonia", "Northern Ireland", "Norway", "Panama", 
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
    "Puerto Rico", "Qatar", "Republic of Ireland", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Solomon Islands", "South Africa", 
    "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
    "Switzerland", "Syria", "Tanzania", "Tonga", "Trinidad and Tobago", "Tunisia", 
    "Tuvalu", "Uganda", "United Arab Emirates", "United States", "Uruguay", "Vanuatu", 
    "Venezuela", "Vietnam", "Wales", "Zambia", "Zimbabwe"
  ];

  const POSITIONS = ["CF", "LF", "RF", "ACM", "DCM", "LCB", "RCB", "LWB", "RWB", "GK"];

  const PRO_EXPERIENCE = ["0", "1", "2", "3", "4-6", "7-9", "10+"];

  const AVAILABILITY = [
    "Free Agent",
    "Contract Ending in Winter 2024",
    "Contract Ending in Summer 2025",
    "Contract Ending in Winter 2025",
    "Contract Ending in Summer 2026",
    "Contract Ending in Winter 2026",
    "Contract ending in Summer 2027"
  ];

  useEffect(() => {
    setPlayers(mockPlayersData);
    setFilteredPlayers(mockPlayersData);
  }, []);

  
 

  // Rest of the component remains the same...
  const handleViewDetails = (player) => {
    setPopupPlayer(player);
    setShowPopup(true);
    setViewedDetailsPlayer(player);
  };

  const handleSavePlayer = (player) => {
    setSavedPlayers([...savedPlayers, player]);
    alert(`Player ${player.name} saved!`);
  };

  const handleUnsavePlayer = (player) => {
    setSavedPlayers(savedPlayers.filter((savedPlayer) => savedPlayer !== player));
    alert(`Player ${player.name} unsaved!`);
  };

  const handleContactPlayer = (player) => {
    alert(`Contacting ${player.name}...`);
  };



  const closePopup = () => {
    setShowPopup(false);
    setPopupPlayer(null);
  };

  return (
    <div className="search-players">
      <h1>Saved Players</h1>

      

      

      {/* Players Grid and Popup Modal remain the same... */}
      <div className="player-grid">
        {filteredPlayers.map((player, index) => (
          <div key={index} className="player-card">
            <div className="player-details">
              <h3>{player.name}</h3>
              <p>Birth Year: {player.birthYear}</p>
              <p>Positions: {player.positions.join(", ")}</p>
              <p>Citizenship: {player.citizenship}</p>
              <p>Availability: {player.currentAvailability}</p>
              <p>Pro Experience: {player.experience} years</p>
              <button onClick={() => handleViewDetails(player)}>View Details</button>
            </div>
            <div className="player-image">
              <div className="image-placeholder">
                <img
                  src={player.profileImage || "/profilepic.jpg"}
                  alt={`${player.name} profile`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && popupPlayer && (
        <div className="player-modal">
          <div className="modal-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <div className="popup-content">
              <div className="popup-image">
                <img
                  src={popupPlayer.profileImage || "profilepic.jpg"}
                  alt={`${popupPlayer.name} profile`}
                />
              </div>
              <div className="popup-details">
                <h3>{popupPlayer.name}</h3>
                <p>Birth Year: {popupPlayer.birthYear}</p>
                <p>Positions: {popupPlayer.positions.join(", ")}</p>
                <p>Citizenship: {popupPlayer.citizenship}</p>
                <p>Availability: {popupPlayer.currentAvailability}</p>
                <p>Pro Experience: {popupPlayer.experience} years</p>
                <p>Highlight Video URL: {popupPlayer.highlightVideoUrl}</p>
                <p>Full Match Video URL: {popupPlayer.fullMatchVideoUrl}</p>
                <p>Player CV: {popupPlayer.playerCV}</p>

                <button onClick={() => handleContactPlayer(popupPlayer)}>Contact Player</button>

                  <button onClick={() => handleUnsavePlayer(popupPlayer)} className="unsave-btn">
                    Unsave Player
                  </button>
                
                  
            
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPlayers;