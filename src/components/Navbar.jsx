import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/Navbar.css';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
      <Link to="/" className="navbar-logo">
          <img src="/playrportal.png" alt="PlayrPortal Logo" className="navbar-logo-img" />
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>

          {!user && (
            <>
              <li className="navbar-item">
                <Link to="/PlayerProfile" className="navbar-link">Players</Link>
              </li>
              <li className="navbar-item">
                <Link to="/ClubProfile" className="navbar-link">Clubs</Link>
              </li>
            </>
          )}

          {user && user.role === "player" && (
            <>
              <li className="navbar-item">
                <Link to="/PlayerProfile" className="navbar-link">My Profile</Link>
              </li>
              <li className="navbar-item">
                <Link to="/opportunities" className="navbar-link">Browse Opportunities</Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </li>
            </>
          )}

          {user && user.role === "club" && (
            <>
              <li className="navbar-item">
                <Link to="/clubProfile" className="navbar-link">My Profile</Link>
              </li>
              <li className="navbar-item">
                <Link to="/search-players" className="navbar-link">Search Players</Link>
              </li>
              <li className="navbar-item">
                <Link to="/saved-players" className="navbar-link">Saved Players</Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
