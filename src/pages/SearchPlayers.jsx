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
import { logEvent } from "@amplitude/analytics-browser";
import { Redirect } from 'react-router-dom'; // Import Redirect


const SearchPlayers = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [players, setPlayers] = useState([]); // All players from the database
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Filtered players
  const [searchTerm, setSearchTerm] = useState(""); // Search term for player name
  const [birthYear, setBirthYear] = useState("");
  const [position, setPosition] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [availability, setAvailability] = useState("");
  const [proExperience, setProExperience] = useState("");
  const [expandedPlayer, setExpandedPlayer] = useState(null); // Track expanded player for details view
  const [savedPlayers, setSavedPlayers] = useState([]); // Track saved players
  const [showPopup, setShowPopup] = useState(false); // Popup visibility
  const [popupPlayer, setPopupPlayer] = useState(null); // Player details in popup
  const [loading, setLoading] = useState(true); // Loading state

  // Fix the API endpoint path
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!isAuthenticated || user.role !== 'club') {
        return <Redirect to="/clubProfile" />;
      }

      try {
        console.log('Fetching players...'); // Debug log
        const response = await api.get('/playerProfiles/all'); // Ensure correct API endpoint
        console.log('Response:', response.data); // Debug log
        
        if (Array.isArray(response.data)) { // Ensure response data is an array
          setPlayers(response.data);
          setFilteredPlayers(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error("Error fetching players:", error.response?.data || error);
      } finally {
        setLoading(false); // Set loading to false after fetching players
      }
    };
    fetchPlayers();
  }, [isAuthenticated, user]);

  // Filter players whenever a filter option changes
  useEffect(() => {
    const filtered = players.filter((player) => {
      return (
        (searchTerm ? player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (birthYear ? player.birthYear === parseInt(birthYear) : true) &&
        (position ? player.positions.includes(position) : true) &&
        (citizenship ? player.citizenship.includes(citizenship) : true) &&
        (availability ? player.availability.includes(availability) : true) &&
        (proExperience ? player.proExperience === proExperience : true) // Treat proExperience as string
      );
    });
    setFilteredPlayers(filtered);
    try {
      logEvent('Player Search', { searchTerm, birthYear, position, citizenship, availability, proExperience });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }, [searchTerm, birthYear, position, citizenship, availability, proExperience, players]);

  const handleViewDetails = (player) => {
    setPopupPlayer(player); // Set player for the popup
    setShowPopup(true); // Show the popup
    try {
      logEvent('View Player Details', { playerId: player._id });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const handleSavePlayer = async (player) => {
    try {
      await api.post(`/clubProfiles/save-player/${player._id}`);
      setSavedPlayers([...savedPlayers, player]);
      try {
        logEvent('Save Player', { playerId: player._id });
      } catch (error) {
        console.error('Failed to log event:', error);
      }
    } catch (error) {
      console.error("Error saving player:", error);
    }
  };

  const handleUnsavePlayer = async (player) => {
    try {
      await api.delete(`/clubProfiles/unsave-player/${player._id}`);
      setSavedPlayers(savedPlayers.filter(p => p._id !== player._id));
      try {
        logEvent('Unsave Player', { playerId: player._id });
      } catch (error) {
        console.error('Failed to log event:', error);
      }
    } catch (error) {
      console.error("Error unsaving player:", error);
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
    setShowPopup(false); // Close the popup
    setPopupPlayer(null); // Reset player details
  };

  const getImageUrl = (player) => {
    if (!player.profileImage) return "profilepic.jpg";
    if (player.profileImage.startsWith('data:image')) return player.profileImage; // Check if already a data URL
    return `data:image/jpeg;base64,${player.profileImage}`; // Convert to data URL
  };

  const getCVLink = (playerCVBase64) => {
    if (!playerCVBase64) return "";
    return `data:application/pdf;base64,${playerCVBase64}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBirthYear("");
    setPosition("");
    setCitizenship("");
    setAvailability("");
    setProExperience("");
    setFilteredPlayers(players);
  };

  return (
    <div className="search-players">
      <h1>Search Players</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setBirthYear(e.target.value)} value={birthYear}>
          <option value="">Select Birth Year</option>
          {BIRTH_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select onChange={(e) => setPosition(e.target.value)} value={position}>
          <option value="">Select Position</option>
          {POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <select onChange={(e) => setCitizenship(e.target.value)} value={citizenship}>
          <option value="">Select Citizenship</option>
          {COUNTRIES.map((cit) => (
            <option key={cit} value={cit}>
              {cit}
            </option>
          ))}
        </select>
        <select onChange={(e) => setAvailability(e.target.value)} value={availability}>
          <option value="">Select Availability</option>
          {AVAILABILITY.map((avail) => (
            <option key={avail} value={avail}>
              {avail}
            </option>
          ))}
        </select>
        <select onChange={(e) => setProExperience(e.target.value)} value={proExperience}>
          <option value="">Select Years of Pro Experience</option>
          {PRO_EXPERIENCE.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </select>
        <button className="reset-filters text-button" onClick={clearFilters}>Clear Filters</button>
      </div>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div className="player-grid">
          {filteredPlayers.map((player, index) => (
            <div key={index} className="player-card">
              <div className="player-details">
                <h3>{player.playerName}</h3> {/* Ensure player's name is displayed first */}
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
      )}

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
                <p>Highlight Video: <a href={popupPlayer.highlightVideo} target="_blank" rel="noopener noreferrer">Watch</a></p>
                <p>Full Match Video: <a href={popupPlayer.fullMatchVideo} target="_blank" rel="noopener noreferrer">Watch</a></p>
                {popupPlayer.playerCV && (
                  <p>
                    Player CV: <a href={getCVLink(popupPlayer.playerCV)} download="playerCV.pdf">Download CV</a>
                  </p>
                )}
                <button onClick={() => handleContactPlayer(popupPlayer)} style={{ marginRight: '10px' }}>
                  Contact Player
                </button>
                {savedPlayers.some(p => p._id === popupPlayer._id) ? (
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

