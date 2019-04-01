import React, { Component } from "react"
import { connect } from "react-redux";

class StateInfo extends Component {
    render() {
        var user = this.props.user
        var token = this.props.token

        return (
            <div>
                <h2>Perfil</h2>
                <form>
                    <div className="form-group">
                        <label for="login">Login</label>
                        <input className="form-control" id="login" value={user.login} readonly />
                    </div>
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input className="form-control" id="name" value={user.name} readonly />
                    </div>
                    <div class="form-group">
                        <label for="name">Permisos</label>
                        <input className="form-control" id="name" value={user.permissions} readonly />
                    </div>
                    <div class="form-group">
                        <label for="name">Token</label>
                        <input className="form-control" id="name" value={token} readonly />
                    </div>
                </form>
            </div>
        )
    }
}

const Info = connect(
    (state) => {
        return {
            user: state.user,
            token: state.token
        };
    })(StateInfo);


export default Info
