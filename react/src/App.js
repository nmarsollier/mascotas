import React, { Component } from 'react';
import Toolbar from './toolbar/Toolbar.js';
import Menu from './menu/Menu.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <table className="table_content">
        <thead>
          <tr className="toolbar">
            <td colSpan="2">
              <Toolbar />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Menu />
            </td>
            <td>
              <div className="main_body">
                <div id="content" className="main_content"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default App;
