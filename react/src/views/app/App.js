import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import Toolbar from './Toolbar.js';
import LoggedInRoute from '../../tools/LoggedInRoute';
import './App.css';
import Info from '../info/Info';
import Login from "../login/Login.js";
import Menu from './Menu.js';
import Welcome from "../welcome/Welcome.js";


class App extends Component {
  render() {
    return (
      <HashRouter>
        <table className="app_table">
          <thead>
            <tr className="app_toolbar">
              <td colSpan="2">
                <Toolbar />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="app_menu">
                <Menu />
              </td>
              <td id="content" className="app_content">
                <Route exact path="/" component={Welcome} />
                <Route exact path="/login" component={Login} />
                <LoggedInRoute path="/info" component={Info} />
              </td>
            </tr>
          </tbody>
        </table>
      </HashRouter >
    );
  }
}

export default App;
