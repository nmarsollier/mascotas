import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../store/sessionStore";
import './Menu.css';

class LoginMenu extends Component {
  render() {
    return (
      <div>
        <h6 className="menu_section">Sesión</h6>
        <NavLink to="/login" className="menu_item btn btn-sm btn-link">Login</NavLink><br />
        <NavLink to="/" className="menu_item btn btn-sm btn-link">Welcome</NavLink><br />
        <NavLink to="/newUser" className="menu_item btn btn-sm btn-link">Registrarse</NavLink><br />
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
        <NavLink to="/info" className="menu_item btn btn-sm btn-link">Sesión</NavLink><br />
        <NavLink to="/password" className="menu_item btn btn-sm btn-link">Password</NavLink><br />
        <NavLink onClick={this.logout} className="menu_item btn btn-sm btn-link">Logout</NavLink><br />

        <h6 className="menu_section">Perfil</h6>
        <NavLink to="/profile" className="menu_item btn btn-sm btn-link">Editar</NavLink><br />

        <h6 className="menu_section">Mascotas</h6>
        <NavLink to="/" className="menu_item btn btn-sm btn-link">Lista</NavLink><br />
      </div>
    )
  }
}

const MainMenu = connect(
  null,
  (dispatch) => {
    return {
      logout: () => logout()
    };
  })(StateMainMenu);

class StateMenu extends Component {
  render() {
    var user = this.props.user
    var menu = user ? <MainMenu user={this.props.user} /> : <LoginMenu />

    return (
      <div className="menu_div navbar-nav bg-light shadow">
        {menu}
      </div>
    );
  }
}

const Menu = connect(
  state => {
    return { user: state.user };
  })(StateMenu);

export default Menu
