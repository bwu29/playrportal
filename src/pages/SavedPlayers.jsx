import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
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
      axios
        .get(`/api/clubProfiles/savedPlayers`)
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
      await axios.delete(`/api/clubProfiles/unsave-player/${player._id}`);
      const updatedPlayers = players.filter((savedPlayer) => savedPlayer._id !== player._id);
      setPlayers(updatedPlayers);
      setFilteredPlayers(updatedPlayers);

      alert(`Player ${player.name} unsaved!`);
    } catch (error) {
      console.error("Failed to unsave player", error);
    }
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
