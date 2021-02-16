import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Navigation from "./components/Navigation.js";
import Login from "./components/Login.js";
import Register from "./components/register.js";
import Wallet from "./components/wallet.js";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  state = {
    loggedIn: null,
    wallet: null,
  };

  handleLogin = (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    fetch(`http://localhost:3000/users/${username}`)
      .then((res) => res.json())
      .then((newWallet) => {
        newWallet === null
          ? console.log("WRONG USERNAME")
          : this.setState({ loggedIn: true, wallet: newWallet });
      });
  };

  handleRegister = (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(username),
    })
      .then((res) => res.json())
      .then((newWallet) => {
        newWallet === null
          ? console.log("INVALID USERNAME")
          : this.setState({ loggedIn: true, wallet: newWallet });
      });
  };

  handleLogout = () => {
    this.setState({
      loggedIn: null,
      wallet: null,
    });
  };

  render() {
    return (
      <Router>
        <div>
          <Navigation
            loggedIn={this.state.loggedIn}
            handleLogout={this.handleLogout}
          />
          <Switch>
            <Route exact path="/login">
              {this.state.loggedIn === true ? (
                <Redirect to="/wallet" />
              ) : (
                <Login handleLogin={this.handleLogin} />
              )}
            </Route>
            <Route exact path="/register">
              {this.state.loggedIn === true ? (
                <Redirect to="/wallet" />
              ) : (
                <Register handleRegister={this.handleRegister} />
              )}
            </Route>
            <Route exact path="/wallet">
              {this.state.loggedIn === true ? (
                <Wallet wallet={this.state.wallet} />
              ) : (
                <Redirect to="/home" />
              )}
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
