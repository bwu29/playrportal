import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/AuthPopup.css";

const AuthPopup = ({ onLoginSuccess }) => {
  const { mockLogin, mockRegister } = useContext(AuthContext); // Add mockRegister
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Track if registering
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (isRegistering) {
      // Registration logic
      const result = mockRegister(username, password);
      if (result.success) {
        onLoginSuccess({ username, role: result.role }); // Notify parent
      } else {
        setError(result.message || "Registration failed");
      }
    } else {
      // Login logic
      const result = mockLogin(username, password);
      if (result.success) {
        onLoginSuccess({ username, role: result.role }); // Notify parent
      } else {
        setError("Invalid username or password");
      }
    }
  };

  return (
    <div className="auth-popup">
      <h2>{isRegistering ? "Register" : "Sign In"}</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{isRegistering ? "Register" : "Sign In"}</button>
      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          className="toggle-link"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(""); // Clear any previous errors
          }}
        >
          {isRegistering ? "Sign In" : "Register"}
        </span>
      </p>
    </div>
  );
};

export default AuthPopup;
