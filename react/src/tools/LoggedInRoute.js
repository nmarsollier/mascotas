import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Welcome from "../views/welcome/Welcome.js";


class StateLoggedInRoute extends Component {
  render() {
    if (this.props.token == undefined) {
      return (<Route exact path={this.props.path} component={Welcome} />)
    } else {
      return (<Route exact path={this.props.path} component={this.props.component} />)
    }
  }
}
const LoggedInRoute = connect(
  (state) => {
    return {
      token: state.token
    };
  })(StateLoggedInRoute);

export default LoggedInRoute;
