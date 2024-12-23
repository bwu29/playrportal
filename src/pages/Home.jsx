import React, { useState, useEffect } from "react";
import SignOn from "../components/AuthPopup";
import { useHistory } from "react-router-dom";
import api from '../utils/api'; // Import the API utility
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentTab, setCurrentTab] = useState(""); // "players" or "clubs"
  const [email, setEmail] = useState(""); // State for email input
  const history = useHistory();

  useEffect(() => {
    if (window.amplitude) {
      console.log('Logging Home Page Visited event...');
      window.amplitude.getInstance().logEvent('Home Page Visited');
    } else {
      console.error('Amplitude is not defined');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    history.push(`/${user.role}Profile`);
  };

  const handleJoinWaitlist = () => {
    setEmail(""); // Clear the email field
    alert("You have successfully joined the waitlist!");
  };

  return (
    <div>
      <section id="hero-section">
        <div className="overview">
          <h1>A Database Connecting Clubs with Professional Female Footballers</h1>
          <p>Revolutionizing the recruitment and transfer space in professional women’s football.</p>
          <div className="waitlist-container">
            <input
              type="email"
              className="waitlist-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="waitlist-button" onClick={handleJoinWaitlist}>Join Our Waitlist</button>
          </div>
        </div>
        <div className="backsplash">
          <img src="/girlkicking.png" alt="soccer player" />
        </div>
      </section>
      <section className="info-section">
        <div className="info-box">
          <h3>Players</h3>
          <ul>
            <li>Create your player profile</li>
            <li>Be seen by 100s of professional Clubs</li>
            <li>Get contacted directly by interested teams</li>
            <li>Pursue your playing opportunity with no middleman or...</li>
            <li>Utilize our trusted agent network</li>
          </ul>
          <button
            className="info-button"
            onClick={() => history.push("/PlayerProfile")}
          >
            Join as a Player
          </button>
        </div>
        <div className="info-box">
          <h3>Clubs</h3>
          <ul>
            <li>Create your club profile</li>
            <li>Access our Database of 500+ professional players</li>
            <li>Use our filters to find your perfect player</li>
            <li>Look through detailed player profiles</li>
            <li>Gain access to players’ direct contact information</li>
          </ul>
          <button
            className="info-button"
            onClick={() => history.push("/ClubProfile")}
          >
            Join as a Club
          </button>
        </div>
      </section>
      <section className="purpose">
        <img src="/PlayrPortalTxt.png" alt="playrportal text" />
        <p>PlayrPortal is a platform used to professionalize the way clubs and players connect. The current transfer and recruitment space in women’s professional football is inefficient, costly and laborious. Our database makes it easy for players to be seen and for clubs to find players that fit their specific roster needs.</p>
      </section>
      {showPopup && (
        <SignOn
          onClose={() => setShowPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
