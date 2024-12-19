import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    history.push('/'); // Redirect to home page after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/playrportal.png" alt="PlayrPortal Logo" className="navbar-logo-img" />
        </Link>
        <button className="navbar-toggle" onClick={toggleDropdown}>
          {isDropdownOpen ? '▲' : '☰'}
        </button>
        <ul className="navbar-menu">
          {!user && (
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
          )}

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
                <Link to="/" onClick={handleLogout} className="navbar-link">Logout</Link>
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
                <Link to="/" onClick={handleLogout} className="navbar-link">Logout</Link>
              </li>
            </>
          )}
        </ul>
        {isDropdownOpen && (
          <ul className="navbar-dropdown">
            {!user && (
              <li className="navbar-item">
                <Link to="/" className="navbar-link" onClick={toggleDropdown}>Home</Link>
              </li>
            )}

            {!user && (
              <>
                <li className="navbar-item">
                  <Link to="/PlayerProfile" className="navbar-link" onClick={toggleDropdown}>Players</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/ClubProfile" className="navbar-link" onClick={toggleDropdown}>Clubs</Link>
                </li>
              </>
            )}

            {user && user.role === "player" && (
              <>
                <li className="navbar-item">
                  <Link to="/PlayerProfile" className="navbar-link" onClick={toggleDropdown}>My Profile</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/opportunities" className="navbar-link" onClick={toggleDropdown}>Browse Opportunities</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/" onClick={handleLogout} className="navbar-link">Logout</Link>
                </li>
              </>
            )}

            {user && user.role === "club" && (
              <>
                <li className="navbar-item">
                  <Link to="/clubProfile" className="navbar-link" onClick={toggleDropdown}>My Profile</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/search-players" className="navbar-link" onClick={toggleDropdown}>Search Players</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/saved-players" className="navbar-link" onClick={toggleDropdown}>Saved Players</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/" onClick={handleLogout} className="navbar-link">Logout</Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
