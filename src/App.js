import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlayerProfile from "./pages/PlayerProfile";
import ClubProfile from "./pages/ClubProfile";
import SearchPlayers from "./pages/SearchPlayers";
import SavedPlayers from "./pages/SavedPlayers";
import Opportunities from "./pages/Opportunities";

const App = () => {
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
