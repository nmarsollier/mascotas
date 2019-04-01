import React, { Component } from "react"
import { connect } from "react-redux"

import './Toolbar.css'

class StateToolbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark d-flex shadow">
        <div className="toolbar_icon">
          <img src="/assets/favicon.png"></img>
        </div>

        <div className="toolbar_title navbar-brand flex-grow-1">
          Mascotas {this.props.user ? " - " + this.props.user.name : ""}
        </div>

        <div className="btn-group navbar-nav">
          <a href="http://localhost:3000/" target="apidoc" className="toolbar_button btn btn-outline-secondary btn-sm nav-link">ApiDoc</a>
        </div>
      </nav>
    );
  }
}

const Toolbar = connect(
  (state) => {
    return { user: state.user };
  })(StateToolbar);

export default Toolbar
