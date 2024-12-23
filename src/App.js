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
import { init } from '@amplitude/analytics-browser';

// Initialize Amplitude with your API key
init('5536de7451587432e3c4a5b69028c1ba');

const App = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.amplitude) {
        console.log('Logging App Loaded event...');
        window.amplitude.getInstance().logEvent('App Loaded');
        console.log('Amplitude event logged successfully');
        clearInterval(interval);
      } else {
        console.error('Amplitude is not defined');
      }
    }, 1000);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/playerProfile" component={PlayerProfile} />
          <Route path="/clubProfile" component={ClubProfile} />
          <Route path="/search-players" component={SearchPlayers} />
          <Route path="/saved-players" component={SavedPlayers} />
          <Route path="/opportunities" component={Opportunities} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
