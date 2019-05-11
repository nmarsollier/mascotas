import React from "react";
import { connect } from "react-redux";
import { changePassword } from "../../api/userApi";
import ErrorComponent from "../../tools/ErrorComponent";
import './Password.css';

class StatePassword extends ErrorComponent {
    constructor(props) {
        super(props)

        this.updatePasswordClick = this.updatePasswordClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.updateState = this.updateState.bind(this);

        this.state = {
            currentPassword: "",
            newPassword: "",
            newPassword2: ""
        }
    }

    updateState(event) {
        var update = {}
        update[event.target.id] = event.target.value
        this.setState(update);
    }

    updatePasswordClick() {
        this.cleanRestValidations()

        if (!this.state.currentPassword) {
            this.addError("currentPassword", "No puede estar vacío")
        }
        if (!this.state.newPassword) {
            this.addError("newPassword", "No puede estar vacío")
        }
        if (this.state.newPassword !== this.state.newPassword2) {
            this.addError("newPassword2", "Las contraseñas no coinciden")
        }
        if (this.hasErrors()) {
            this.forceUpdate()
            return
        }

        this.props.changePassword(this.state).then(result => {
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
                <h2 className="global_title">Cambiar Password</h2>

                <form>
                    <div className="form-group">
                        <label for="currentPassword">Password Actual</label>
                        <input id="currentPassword" type="password" onChange={this.updateState} className={this.getErrorClass("currentPassword", "form-control")}></input>
                        <div hidden={!this.getErrorText('currentPassword')} class="invalid-feedback">{this.getErrorText('currentPassword')}</div>
                    </div>

                    <div className="form-group">
                        <label for="newPassword">Nuevo Password</label>
                        <input id="newPassword" type="password" onChange={this.updateState} className={this.getErrorClass("newPassword", "form-control")}></input>
                        <div hidden={!this.getErrorText('newPassword')} class="invalid-feedback">{this.getErrorText('newPassword')}</div>
                    </div>

                    <div className="form-group">
                        <label for="newPassword2">Repetir Password</label>
                        <input id="newPassword2" type="password" onChange={this.updateState} className={this.getErrorClass("newPassword2", "form-control")}></input>
                        <div hidden={!this.getErrorText('newPassword2')} class="invalid-feedback">{this.getErrorText('newPassword2')}</div>
                    </div>

                    <div hidden={!this.errorMessage} class="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.updatePasswordClick}>Cambiar</button>
                        <button className="btn btn-light" onClick={this.cancelClick} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const Password = connect(
    null,
    (dispatch) => {
        return {
            changePassword: user => changePassword(user),
        };
    }
)(StatePassword);

export default Password