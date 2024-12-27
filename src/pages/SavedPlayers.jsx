import React, { useState, useEffect, useContext } from "react";
import api from '../utils/api'; // Ensure api is imported
import { AuthContext } from "../context/AuthContext";
import "../styles/SearchPlayers.css";
import { logEvent } from "@amplitude/analytics-browser";

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
        .get(`/api/clubProfiles/savedPlayers`)
        .then((response) => {
          console.log("API Response:", response); // Log the API response
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
    try {
      logEvent('View Player Details', { playerId: player._id });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const handleUnsavePlayer = async (player) => {
    try {
      await api.delete(`/api/clubProfiles/unsave-player/${player._id}`);
      const updatedPlayers = players.filter((savedPlayer) => savedPlayer._id !== player._id);
      setPlayers(updatedPlayers);
      setFilteredPlayers(updatedPlayers);
      try {
        logEvent('Unsave Player', { playerId: player._id });
      } catch (error) {
        console.error('Failed to log event:', error);
      }
      alert(`Player ${player.playerName} unsaved!`);
    } catch (error) {
      console.error("Failed to unsave player", error);
    }
  };

  const handleContactPlayer = async (player) => {
    try {
      await api.post('/contactRequests', { playerId: player._id });
      alert("Your contact request has been submitted. You will receive an email shortly.");
      try {
        logEvent('Contact Player', { playerId: player._id });
      } catch (error) {
        console.error('Failed to log event:', error);
      }
    } catch (error) {
      console.error("Error contacting player:", error);
      alert("Failed to submit contact request. Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupPlayer(null);
  };

  return (
    <div className="search-players">
      <h1>Saved Players for {user?.club}</h1>

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

                <button onClick={() => handleViewDetails(player)}>View Details</button>
              </div>

              <div className="player-image">
                <img src={player.profileImage || "/profilepic.jpg"} alt={`${player.playerName} profile`} />
              </div>

              <button onClick={() => handleUnsavePlayer(player)} className="unsave-btn">
                Unsave Player
              </button>
            </div>
          ))}
        </div>
      )}

      {showPopup && popupPlayer && (
        <div className="player-modal">
          <span className="close" onClick={closePopup}>&times;</span>

          <div className="popup-content">
            <img src={popupPlayer.profileImage || "/profilepic.jpg"} alt={`${popupPlayer.playerName}`} />
            <div className="popup-details">
              <h3>{popupPlayer.playerName}</h3>
              <p>Birth Year: {popupPlayer.birthYear}</p>
              <p>Positions: {popupPlayer.positions.join(", ")}</p>
              <p>Citizenship: {popupPlayer.citizenship.join(", ")}</p>

              <button onClick={() => handleContactPlayer(popupPlayer)}>Contact Player</button>
              <button onClick={() => handleUnsavePlayer(popupPlayer)} className="unsave-btn">
                Unsave Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPlayers;
