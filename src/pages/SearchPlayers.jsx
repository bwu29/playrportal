import React, { useState, useEffect } from "react";
import mockPlayersData from "../mock/mockplayers.json";
import "../styles/SearchPlayers.css";

const SearchPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [birthYear, setBirthYear] = useState("");
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
    "Contract ending in Winter 2024",
    "Contract ending in Summer 2025",
    "Contract ending in Winter 2025",
    "Contract ending in Summer 2026",
    "Contract ending in Winter 2026",
    "Contract ending in Summer 2027"
  ];

  useEffect(() => {
    setPlayers(mockPlayersData);
    setFilteredPlayers(mockPlayersData);
  }, []);

  // Generate birth years from 1984 to 2010
  const birthYears = Array.from({ length: 2010 - 1984 + 1 }, (_, i) => 2010 - i);

  // Updated filter function to handle multiple citizenships
  useEffect(() => {
    const filtered = players.filter((player) => {
      // Split player's citizenship string into array if it contains multiple citizenships
      const playerCitizenships = player.citizenship.split(/,\s*|-\s*/);
      
      return (
        (birthYear ? player.birthYear === parseInt(birthYear) : true) &&
        (position ? player.positions.includes(position) : true) &&
        (citizenship ? playerCitizenships.some(c => c.trim() === citizenship) : true) &&
        (availability ? player.currentAvailability === availability : true) &&
        (proExperience ? 
          (typeof player.experience === 'number' ? 
            matchProExperience(player.experience, proExperience) : 
            player.experience === proExperience
          ) : true) &&
        (searchTerm ? player.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      );
    });
    setFilteredPlayers(filtered);
  }, [birthYear, position, citizenship, availability, proExperience, searchTerm, players]);

  // Helper function to match pro experience ranges
  const matchProExperience = (playerExp, filterExp) => {
    if (filterExp === "0") return playerExp === 0;
    if (filterExp === "1") return playerExp === 1;
    if (filterExp === "2") return playerExp === 2;
    if (filterExp === "3") return playerExp === 3;
    if (filterExp === "4-6") return playerExp >= 4 && playerExp <= 6;
    if (filterExp === "7-9") return playerExp >= 7 && playerExp <= 9;
    if (filterExp === "10+") return playerExp >= 10;
    return true;
  };

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

  const handleResetFilters = () => {
    setBirthYear("");
    setPosition("");
    setCitizenship("");
    setAvailability("");
    setProExperience("");
    setSearchTerm("");
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupPlayer(null);
  };

  return (
    <div className="search-players">
      <h1>Search Players</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters">
  <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
    <option value="">Select Birth Year</option>
    {birthYears.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>

  <select value={position} onChange={(e) => setPosition(e.target.value)}>
    <option value="">Select Position</option>
    {POSITIONS.map((pos) => (
      <option key={pos} value={pos}>
        {pos}
      </option>
    ))}
  </select>

  <select value={citizenship} onChange={(e) => setCitizenship(e.target.value)}>
    <option value="">Select Citizenship</option>
    {COUNTRIES.map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ))}
  </select>

  <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
    <option value="">Select Availability</option>
    {AVAILABILITY.map((avail) => (
      <option key={avail} value={avail}>
        {avail}
      </option>
    ))}
  </select>

  <select value={proExperience} onChange={(e) => setProExperience(e.target.value)}>
    <option value="">Select Years of Pro Experience</option>
    {PRO_EXPERIENCE.map((exp) => (
      <option key={exp} value={exp}>
        {exp} {exp === "1" ? "year" : "years"}
      </option>
    ))}
  </select>

  <button className="reset-filters" onClick={handleResetFilters}>
    Reset Filters
  </button>
</div>


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
                  src={popupPlayer.profileImage || "/profilepic.jpg"}
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