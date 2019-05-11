import React from "react";
import { connect } from "react-redux";
import { login } from "../../store/sessionStore";
import ErrorComponent from "../../tools/ErrorComponent";
import './Login.css';

class StateLogin extends ErrorComponent {
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

    loginClick() {
        this.cleanRestValidations()
        if (!this.state.login) {
            this.addError("login", "No puede estar vacío")
        }
        if (!this.state.password) {
            this.addError("password", "No puede estar vacío")
        }

        if (this.hasErrors()) {
            this.forceUpdate()
            return
        }

        this.props.login(this.state).then(result => {
            this.props.history.push('/')
        }).catch(error => {
            this.processRestValidations(error.response.data)
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
                        <label>Usuario</label>
                        <input id="login" type="text" onChange={this.updateState} className={this.getErrorClass("login", "form-control")}></input>
                        <div hidden={!this.getErrorText('login')} class="invalid-feedback">{this.getErrorText('login')}</div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input id="password" type="password" onChange={this.updateState} className={this.getErrorClass("password", "form-control")}></input>
                        <div hidden={!this.getErrorText('password')} class="invalid-feedback">{this.getErrorText('password')}</div>
                    </div>

                    <div hidden={!this.errorMessage} class="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.loginClick}>Login</button>
                        <button className="btn btn-light" onClick={this.cancelClick} >Cancel</button >
                    </div >
                </form >
            </div >
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