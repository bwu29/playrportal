import React, { createContext, useState, useEffect } from "react";
import mockUsers from "../mock/mockUsers"; // Import JSON data

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulate fetching users (if required)
    setUsers(mockUsers);
  }, []);

  const mockLogin = (username, password) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser); // Update user state
      return { success: true, role: foundUser.role }; // Return role for navigation
    }

    return { success: false }; // Invalid credentials
  };

  const mockLogout = () => {
    setUser(null); // Clear user state
  };
  const mockRegister = (username, password) => {
    const existingUser = mockUsers.find((u) => u.username === username);
  
    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }
  
    const newUser = { username, password, role: "player" }; // Default to "player" role
    mockUsers.push(newUser); // Add user to the mock data
    return { success: true, role: newUser.role };
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, mockLogin, mockLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
