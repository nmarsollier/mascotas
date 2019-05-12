import React from "react";
import { connect } from "react-redux";
import { newUser } from "../../store/sessionStore";
import ErrorComponent from "../../tools/ErrorComponent";
import './Register.css';
import ErrorLabel from "../tools/ErrorLabel";

class StateRegister extends ErrorComponent {
    constructor(props) {
        super(props)

        this.registerClick = this.registerClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.updateState = this.updateState.bind(this);

        this.state = {
            login: "",
            name: "",
            password: "",
            password2: ""
        }
    }

    registerClick() {
        this.cleanRestValidations()
        if (!this.state.login) {
            this.addError("login", "No puede estar vacío")
        }
        if (!this.state.name) {
            this.addError("name", "ReqNo puede estar vacíouerido")
        }
        if (!this.state.password) {
            this.addError("password", "No puede estar vacío")
        }
        if (this.state.password !== this.state.password2) {
            this.addError("password2", "Las contraseñas no coinciden")
        }

        if (this.hasErrors()) {
            this.forceUpdate()
            return
        }

        this.props.newUser(this.state).then(result => {
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
            <div className="register_content">
                <h2 className="global_title">Registrar Usuario</h2>

                <form>
                    <div className="form-group">
                        <label>Login</label>
                        <input id="login" type="text" onChange={this.updateState} className={this.getErrorClass("login", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('login')} />
                    </div>

                    <div className="form-group">
                        <label>Usuario</label>
                        <input id="name" type="text" onChange={this.updateState} className={this.getErrorClass("name", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('name')} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input id="password" type="password" onChange={this.updateState} className={this.getErrorClass("password", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('password')} />
                    </div>

                    <div className="form-group">
                        <label>Repetir Password</label>
                        <input id="password2" type="password" onChange={this.updateState} className={this.getErrorClass("password2", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('password2')} />
                    </div>

                    <div hidden={!this.errorMessage} class="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.registerClick}>Registrarse</button>
                        <button className="btn btn-light" onClick={this.cancelClick} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const Register = connect(
    null,
    (dispatch) => {
        return {
            newUser: user => newUser(user),
        };
    }
)(StateRegister);

export default Register