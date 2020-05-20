import React from "react";
import { useSelector } from "react-redux";
import { IStoredState } from "../store/sessionStore";

export default function StateInfo() {
    const user = useSelector((state: IStoredState) => state.user)
    const token = useSelector((state: IStoredState) => state.token)

    return (
        <div>
            <h2>Información de Perfil</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Login</label>
                    <input className="form-control" id="login" value={user?.login} disabled />
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input className="form-control" id="name" value={user?.name} disabled />
                </div>
                <div className="form-group">
                    <label>Permisos</label>
                    <input className="form-control" id="name" value={user?.permissions} disabled />
                </div>
                <div className="form-group">
                    <label>Token</label>
                    <input className="form-control" id="name" value={token} disabled />
                </div>
            </form>
        </div>
    );
}

