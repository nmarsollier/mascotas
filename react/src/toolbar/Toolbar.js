import React, { Component } from "react"
import { connect } from "react-redux"

import './Toolbar.css'

class StateToolbar extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-sm bg-dark navbar-dark d-flex shadow">
        <div className="icon">
          <img src="/assets/favicon.png"></img>
        </div>

        <div className="title navbar-brand flex-grow-1">
          Mascotas {this.props.user ? " - " + this.props.user.userName : ""}
        </div>

        <div className="btn-group navbar-nav">
          <a href="http://localhost:3000/" target="apidoc" className="button btn btn-outline-secondary btn-sm nav-link">ApiDoc</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
};
const Toolbar = connect(mapStateToProps)(StateToolbar);

export default Toolbar
