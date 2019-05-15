import React from "react";
import { connect } from "react-redux";
import { changePassword } from "../../api/userApi";
import CommonComponent from "../../tools/CommonComponent";
import '../../styles.css';
import ErrorLabel from "../../tools/ErrorLabel";

class StatePassword extends CommonComponent {
    constructor(props) {
        super(props)

        this.state = {
            currentPassword: "",
            newPassword: "",
            newPassword2: ""
        }
    }

    updatePasswordClick = () => {
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

    render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Cambiar Password</h2>

                <form>
                    <div className="form-group">
                        <label>Password Actual</label>
                        <input id="currentPassword" type="password" onChange={this.updateState} className={this.getErrorClass("currentPassword", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('currentPassword')} />
                    </div>

                    <div className="form-group">
                        <label>Nuevo Password</label>
                        <input id="newPassword" type="password" onChange={this.updateState} className={this.getErrorClass("newPassword", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('newPassword')} />
                    </div>

                    <div className="form-group">
                        <label>Repetir Password</label>
                        <input id="newPassword2" type="password" onChange={this.updateState} className={this.getErrorClass("newPassword2", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('newPassword2')} />
                    </div>

                    <div hidden={!this.errorMessage} className="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.updatePasswordClick}>Cambiar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
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