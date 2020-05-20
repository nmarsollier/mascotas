import React, { useState } from "react";
import { newUser } from "../store/sessionStore";
import "../styles.css";
import ErrorLabel from "../common/components/ErrorLabel";
import useErrorHandler from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";
import DangerLabel from "../common/components/DangerLabel";

export default function Register(props: DefaultProps) {
    const [login, setLogin] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const errorHandler = useErrorHandler()

    const registerClick = async () => {
        errorHandler.cleanRestValidations();
        if (!login) {
            errorHandler.addError("login", "No puede estar vacío");
        }
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío");
        }
        if (!password) {
            errorHandler.addError("password", "No puede estar vacío");
        }
        if (password !== password2) {
            errorHandler.addError("password2", "Las contraseñas no coinciden");
        }

        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            await newUser({
                login,
                name,
                password,
            });
            goHome(props)
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <h2 className="global_title">Registrar Usuario</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Login</label>
                    <input id="login" type="text"
                        onChange={event => setLogin(event.target.value)}
                        className={errorHandler.getErrorClass("login", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("login")} />
                </div>

                <div className="form-group">
                    <label>Usuario</label>
                    <input id="name" type="text"
                        onChange={event => setName(event.target.value)}
                        className={errorHandler.getErrorClass("name", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("name")} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input id="password" type="password"
                        onChange={event => setPassword(event.target.value)}
                        className={errorHandler.getErrorClass("password", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("password")} />
                </div>

                <div className="form-group">
                    <label>Repetir Password</label>
                    <input id="password2" type="password"
                        onChange={event => setPassword2(event.target.value)}
                        className={errorHandler.getErrorClass("password2", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("password2")} />
                </div>

                <DangerLabel message={errorHandler.errorMessage} />

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={registerClick}>Registrarse</button>
                    <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
                </div >
            </form >
        </div>
    );
}
