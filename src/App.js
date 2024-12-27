import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SavedPlayers from "./pages/SavedPlayers";
import Opportunities from "./pages/Opportunities";
import Footer from "./components/Footer"; // Import Footer component
import { init, logEvent } from "@amplitude/analytics-browser";

// Initialize Amplitude
init("5536de7451587432e3c4a5b69028c1ba", {
  defaultTracking: true,
});

const App = () => {
  useEffect(() => {
    console.log("Logging App Loaded event...");
    try {
      logEvent("App Loaded");
      console.log("Amplitude event logged successfully");
    } catch (error) {
      console.error("Failed to log event:", error);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/playerProfile" component={PlayerProfile} />
          <Route path="/clubProfile" component={ClubProfile} />
          <Route path="/search-players" component={SearchPlayers} />
          <Route path="/saved-players" component={SavedPlayers} />
          <Route path="/opportunities" component={Opportunities} />
        </Switch>
        <Footer /> 
      </AuthProvider>
    </Router>
  );
};

export default App;
