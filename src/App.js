import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SavedPlayers from "./pages/SavedPlayers";
import Opportunities from "./pages/Opportunities";
import { init, logEvent } from "@amplitude/analytics-browser";

// Initialize Amplitude
init("5536de7451587432e3c4a5b69028c1ba", {
  defaultTracking: true,
});

const AppContent = () => {
  const { loading, user } = useContext(AuthContext);

  useEffect(() => {
    console.log("Logging App Loaded event...");
    try {
      logEvent("App Loaded");
      console.log("Amplitude event logged successfully");
    } catch (error) {
      console.error("Failed to log event:", error);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/playerProfile" component={PlayerProfile} />
        <Route path="/clubProfile" component={ClubProfile} />
        <Route path="/search-players" component={SearchPlayers} />
        <Route path="/saved-players" component={SavedPlayers} />
        <Route path="/opportunities" component={Opportunities} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
