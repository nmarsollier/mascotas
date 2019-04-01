import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../store/sessionStore";
import './Menu.css';

class LoginMenu extends Component {
  render() {
    return (
      <div>
        <h6 className="section">Sesión</h6>
        <NavLink to="/login" className="item btn btn-sm btn-link">Login</NavLink>
        <NavLink to="/" className="item btn btn-sm btn-link">Welcome</NavLink>
        <NavLink to="/" className="item btn btn-sm btn-link">Registrarse</NavLink>
      </div>
    )
  }
}

class StateMainMenu extends Component {
  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout() {
    this.props.logout().then()
  }

  render() {
    return (
      <div>
        <NavLink to="/" className="item btn btn-sm btn-link">Sesión</NavLink>
        <NavLink to="/" className="item btn btn-sm btn-link">Password</NavLink>
        <NavLink onClick={this.logout} className="item btn btn-sm btn-link">Logout</NavLink><br />

        <h6 className="section">Perfil</h6>
        <NavLink to="/" className="item btn btn-sm btn-link">Editar</NavLink>

        <h6 className="section">Mascotas</h6>
        <NavLink to="/" className="item btn btn-sm btn-link">Lista</NavLink>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => logout()
  };
}
const MainMenu = connect(null, mapDispatchToProps)(StateMainMenu);

class StateMenu extends Component {
  render() {
    var user = this.props.user
    var menu = user ? <MainMenu user={this.props.user} /> : <LoginMenu />

    return (
      <div className="menu navbar-nav bg-light shadow">
        {menu}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};
const Menu = connect(mapStateToProps)(StateMenu);

export default Menu
