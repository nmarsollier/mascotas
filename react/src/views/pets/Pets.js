import React from "react";
import { connect } from "react-redux";
import { newUser } from "../../store/sessionStore";
import CommonComponent from "../../tools/CommonComponent";
import '../../styles.css';
import ErrorLabel from "../../tools/ErrorLabel";

class StatePets extends CommonComponent {
    constructor(props) {
        super(props)

        this.registerClick = this.registerClick.bind(this)

        this.state = {
            login: "",
            name: "",
            password: "",
            password2: ""
        }
    }

    render() {
        return (
            <div className="global_content">
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
                        <button className="btn btn-light" onClick={this.goHome} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const Pets = connect(
    null,
    (dispatch) => {
        return {
            newUser: user => newUser(user),
        };
    }
)(StatePets);

export default Pets