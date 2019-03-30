import React, { Component } from "react"
import { connect } from "react-redux"
import { login, logout } from "../store/sessionStore"
import './Menu.css'


class StateLoginMenu extends Component {
  constructor(props) {
    super(props)

    this.login = this.login.bind(this)
  }

  login() {
    this.props.login({
      "login": "admin",
      "password": "admin"
    })
  }

  render() {
    return (
      <div>
        <h6 className="section">Sesión</h6>
        <a onClick={this.login} className="item btn btn-sm btn-link"> Login</a ><br />
        <a className="item btn btn-sm btn-link"> Registrarse</a ><br />
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
    this.props.logout()
  }

  render() {
    return (
      <div>
        <h6 className="section">{this.props.user.name}</h6>
        <a className="item btn btn-sm btn-link">Sesión</a> <br />
        <a className="item btn btn-sm btn-link">Password</a> <br />
        <a onClick={this.logout} className="item btn btn-sm btn-link">Logout</a> <br />

        <h6 className="section">Perfil</h6>
        <a className="item btn btn-sm btn-link">Editar</a> <br />

        <h6 className="section">Mascotas</h6>
        <a className="item btn btn-sm btn-link">Lista</a> <br />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: user => login(user),
    logout: () => logout()
  };
}
const LoginMenu = connect(null, mapDispatchToProps)(StateLoginMenu);
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
