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