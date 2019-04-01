import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../../store/sessionStore";
import './Login.css';

class StateLogin extends Component {
    constructor(props) {
        super(props)

        this.loginClick = this.loginClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.updateState = this.updateState.bind(this);

        this.state = {
            login: "",
            password: ""
        }
    }

    updateState(event) {
        var update = {}
        update[event.target.id] = event.target.value
        this.setState(update);
    }

    loginClick() {
        this.props.login(this.state).then(result => {
            this.props.history.push('/')
        }).catch(error => {

        })
    }

    cancelClick() {
        this.props.history.push('/')
    }

    render() {
        return (
            <div className="login_content">
                <h2 className="global_title">Login</h2>

                <form>
                    <div className="form-group">
                        <label for="login">Usuario</label>
                        <input id="login" type="text" onChange={this.updateState} placeholder="Nombre de usuario" className="form-control"></input>
                    </div>

                    <div className="form-group">
                        <label for="password">Password</label>
                        <input id="password" type="password" onChange={this.updateState} placeholder="Contrase&ntilde;a" className="form-control"></input>
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.loginClick}>Login</button>
                        <button className="btn btn-light" onClick={this.cancelClick} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const Login = connect(
    null,
    (dispatch) => {
        return {
            login: user => login(user),
        };
    }
)(StateLogin);

export default Login