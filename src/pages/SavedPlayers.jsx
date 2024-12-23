import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from '../utils/api';
import "../styles/SearchPlayers.css";

const SavedPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPlayer, setPopupPlayer] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      // Fetch saved players from the backend API
      api
        .get('/clubProfiles/savedPlayers')
        .then((response) => {
          const clubSavedPlayers = response.data;
          if (Array.isArray(clubSavedPlayers)) {
            setPlayers(clubSavedPlayers);
            setFilteredPlayers(clubSavedPlayers);
          } else {
            console.error("Unexpected response data format:", clubSavedPlayers);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch saved players:", error);
        });
    }
  }, [user]);

  const handleViewDetails = (player) => {
    setPopupPlayer(player);
    setShowPopup(true);
  };

  const handleUnsavePlayer = async (player) => {
    try {
      await api.delete(`/clubProfiles/unsave-player/${player._id}`);
      const updatedPlayers = players.filter((savedPlayer) => savedPlayer._id !== player._id);
      setPlayers(updatedPlayers);
      setFilteredPlayers(updatedPlayers);

      alert(`Player ${player.playerName} unsaved!`);
    } catch (error) {
      console.error("Failed to unsave player", error);
    }
  };

  const handleContactPlayer = async (player) => {
    try {
      await api.post('/contactRequests', { playerId: player._id });
      alert("Your contact request has been submitted. You will receive an email shortly.");
    } catch (error) {
      console.error("Failed to contact player", error);
      alert("Failed to submit contact request. Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupPlayer(null);
  };

  const getImageUrl = (player) => {
    if (!player.profileImage) return "profilepic.jpg";
    if (player.profileImage.startsWith('data:image')) return player.profileImage; // Check if already a data URL
    return `data:image/jpeg;base64,${player.profileImage}`; // Convert to data URL
  };

  return (
    <div className="search-players">
      <h1>Saved Players</h1>

      {filteredPlayers.length === 0 ? (
        <p>No saved players yet.</p>
      ) : (
        <div className="player-grid">
          {filteredPlayers.map((player) => (
            <div key={player._id} className="player-card">
              <div className="player-details">
                <h3>{player.playerName}</h3>
                <p>Birth Year: {player.birthYear}</p>
                <p>Positions: {player.positions.join(", ")}</p>
                <p>Citizenship: {player.citizenship.join(", ")}</p>
                <p>Availability: {player.availability}</p>
                <p>Pro Experience: {player.proExperience} years</p>
                <button onClick={() => handleViewDetails(player)}>View Details</button>
              </div>
              <div className="player-image">
                <div className="image-placeholder">
                  <img
                    src={getImageUrl(player)}
                    alt={`${player.playerName || 'Player'} profile`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "profilepic.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && popupPlayer && (
        <div className="player-modal">
          <div className="modal-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <div className="popup-content">
              <div className="popup-image">
                <img
                  src={getImageUrl(popupPlayer)}
                  alt={`${popupPlayer.name} profile`}
                />
              </div>
              <div className="popup-details">
                <h3>{popupPlayer.name}</h3>
                <p>Birth Year: {popupPlayer.birthYear}</p>
                <p>Positions: {popupPlayer.positions.join(", ")}</p>
                <p>Citizenship: {popupPlayer.citizenship.join(", ")}</p>
                <p>Availability: {popupPlayer.availability}</p>
                <p>Pro Experience: {popupPlayer.proExperience} years</p>
                <p>Highlight Video: <a href={popupPlayer.highlightVideo} target="_blank" rel="noopener noreferrer">Watch</a></p>
                <p>Full Match Video: <a href={popupPlayer.fullMatchVideo} target="_blank" rel="noopener noreferrer">Watch</a></p>
                {popupPlayer.playerCV && (
                  <p>
                    Player CV: <a href={`data:application/pdf;base64,${popupPlayer.playerCV}`} download="playerCV.pdf">Download CV</a>
                  </p>
                )}
                <button onClick={() => handleContactPlayer(popupPlayer)} style={{ marginRight: '10px' }}>
                  Contact Player
                </button>
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
