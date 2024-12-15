import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from '../utils/api';
import "../styles/SearchPlayers.css";
import {
  BIRTH_YEARS,
  POSITIONS,
  COUNTRIES,
  AVAILABILITY,
  PRO_EXPERIENCE,
} from "../constants/dropdownOptions";

const SearchPlayers = () => {
  const { user } = useContext(AuthContext);
  const [players, setPlayers] = useState([]); // All players from the database
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Filtered players
  const [birthYear, setBirthYear] = useState("");
  const [position, setPosition] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [availability, setAvailability] = useState("");
  const [proExperience, setProExperience] = useState("");
  const [expandedPlayer, setExpandedPlayer] = useState(null); // Track expanded player for details view
  const [savedPlayers, setSavedPlayers] = useState([]); // Track saved players
  const [showPopup, setShowPopup] = useState(false); // Popup visibility
  const [popupPlayer, setPopupPlayer] = useState(null); // Player details in popup

  // Fix the API endpoint path
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!user || user.role !== 'club') {
        console.error('Only club users can access this page');
        return;
      }

      try {
        console.log('Fetching players...'); // Debug log
        const response = await api.get('/playerProfiles/all'); // Remove extra 'api'
        console.log('Response:', response.data); // Debug log
        
        if (response.data) {
          setPlayers(response.data);
          setFilteredPlayers(response.data);
        }
      } catch (error) {
        console.error("Error fetching players:", error.response?.data || error);
      }
    };
    fetchPlayers();
  }, [user]);

  // Filter players whenever a filter option changes
  useEffect(() => {
    const filtered = players.filter((player) => {
      return (
        (birthYear ? player.birthYear === parseInt(birthYear) : true) &&
        (position ? player.positions.includes(position) : true) &&
        (citizenship ? player.citizenship.includes(citizenship) : true) &&
        (availability ? player.availability.includes(availability) : true) &&
        (proExperience ? player.proExperience === parseInt(proExperience) : true)
      );
    });
    setFilteredPlayers(filtered);
  }, [birthYear, position, citizenship, availability, proExperience, players]);

  const handleViewDetails = (player) => {
    setPopupPlayer(player); // Set player for the popup
    setShowPopup(true); // Show the popup
  };

  const handleSavePlayer = async (player) => {
    try {
      await api.post(`/api/clubProfiles/save-player/${player._id}`);
      setSavedPlayers([...savedPlayers, player]);
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  const handleUnsavePlayer = async (player) => {
    try {
      await api.delete(`/api/clubProfiles/unsave-player/${player._id}`);
      setSavedPlayers(savedPlayers.filter(p => p._id !== player._id));
    } catch (error) {
      console.error("Error unsaving player:", error);
    }
  };

  const handleContactPlayer = (player) => {
    alert(`Contacting ${player.name}...`);
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
    setPopupPlayer(null); // Reset player details
  };

  const getImageUrl = (player) => {
    if (!player.profileImage) return "profilepic.jpg";
    if (typeof player.profileImage === 'string') return player.profileImage;
    return `${api.defaults.baseURL}/playerProfiles/profile/image/${player._id}`;
  };

  return (
    <div className="search-players">
      <h1>Search Players</h1>
      <div className="filters">
        <select onChange={(e) => setBirthYear(e.target.value)}>
          <option value="">Select Birth Year</option>
          {BIRTH_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select onChange={(e) => setPosition(e.target.value)}>
          <option value="">Select Position</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <select onChange={(e) => setCitizenship(e.target.value)}>
          <option value="">Select Citizenship</option>
          {COUNTRIES.map((cit) => (
            <option key={cit} value={cit}>
              {cit}
            </option>
          ))}
        </select>
        <select onChange={(e) => setAvailability(e.target.value)}>
          <option value="">Select Availability</option>
          {AVAILABILITY.map((avail) => (
            <option key={avail} value={avail}>
              {avail}
            </option>
          ))}
        </select>
        <select onChange={(e) => setProExperience(e.target.value)}>
          <option value="">Select Years of Pro Experience</option>
          {PRO_EXPERIENCE.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>
      <div className="player-grid">
        {filteredPlayers.map((player, index) => (
          <div key={index} className="player-card">
            <div className="player-details">
              <h3>{player.name}</h3>
              <p>Birth Year: {player.birthYear}</p>
              <p>Positions: {player.positions.join(", ")}</p>
              <p>Citizenship: {player.citizenship}</p>
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

      {/* Popup Modal for Player Details */}
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
                <p>Citizenship: {popupPlayer.citizenship}</p>
                <p>Availability: {popupPlayer.availability}</p>
                <p>Pro Experience: {popupPlayer.proExperience} years</p>
                <p>Highlight Video URL: {popupPlayer.highlightVideoUrl}</p>
                <p>Full Match Video URL: {popupPlayer.fullMatchVideoUrl}</p>
                <p>Player CV: {popupPlayer.playerCV}</p>
                <button onClick={() => handleContactPlayer(popupPlayer)}>
                  Contact Player
                </button>
                {savedPlayers.includes(popupPlayer) ? (
                  <button onClick={() => handleUnsavePlayer(popupPlayer)} className="unsave-btn">
                    Unsave Player
                  </button>
                ) : (
                  <button onClick={() => handleSavePlayer(popupPlayer)} className="save-btn">
                    Save Player
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPlayers;

