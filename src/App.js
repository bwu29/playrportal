import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SavedPlayers from "./pages/SavedPlayers"
import Opportunities from "./pages/Opportunities";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playerProfile" element={<PlayerProfile />} />
          <Route path="/clubProfile" element={<ClubProfile />} />
          <Route path="/search-players" element={<SearchPlayers />} />
          <Route path="/saved-players" element={<SavedPlayers />} />
          <Route path="/opportunities" element={<Opportunities />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
