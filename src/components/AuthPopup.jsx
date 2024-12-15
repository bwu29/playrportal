import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/AuthPopup.css";

const AuthPopup = ({ onLoginSuccess, defaultRole }) => {
  const { login, register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: defaultRole // Set the role without showing selector
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username || !formData.password || (isRegistering && !formData.email)) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = isRegistering
        ? await register({ ...formData, role: defaultRole }) // Ensure role is set during registration
        : await login(formData.username, formData.password);

      if (result.success) {
        onLoginSuccess(result);
      } else {
        setError(result.message || "Authentication failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-popup">
      <h2>{isRegistering ? "Register" : "Sign In"}</h2>
      {error && <p className="error">{error}</p>}
      
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      
      {isRegistering && (
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      )}
      
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        disabled={isLoading}
      />

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Processing..." : isRegistering ? "Register" : "Sign In"}
      </button>
      
      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <span className="toggle-link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Sign In" : "Register"}
        </span>
      </p>
    </div>
  );
};

export default AuthPopup;
