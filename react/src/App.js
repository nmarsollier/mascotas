import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import './App.css';
import Login from "./login/Login.js";
import Menu from './menu/Menu.js';
import Toolbar from './toolbar/Toolbar.js';
import Welcome from "./welcome/Welcome.js";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <table className="main_table">
          <thead>
            <tr className="main_toolbar">
              <td colSpan="2">
                <Toolbar />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="main_menu">
                <Menu />
              </td>
              <td id="content" className="main_content">
                <Route exact path="/" component={Welcome} />
                <Route exact path="/login" component={Login} />
              </td>
            </tr>
          </tbody>
        </table>
      </HashRouter>
    );
  }
}

export default App;
