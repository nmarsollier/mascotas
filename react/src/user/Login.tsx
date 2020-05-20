import React, { useState } from "react";
import DangerLabel from "../common/components/DangerLabel";
import ErrorLabel from "../common/components/ErrorLabel";
import useErrorHandler from "../common/utils/ErrorHandler";
import { DefaultProps, goHome } from "../common/utils/Tools";
import { login } from "../store/sessionStore";
import "../styles.css";

export default function Login(props: DefaultProps) {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const errorHandler = useErrorHandler()

    const loginClick = async () => {
        errorHandler.cleanRestValidations();
        if (!login) {
            errorHandler.addError("login", "No puede estar vacío");
        }
        if (!password) {
            errorHandler.addError("password", "No puede estar vacío");
        }

        try {
            await login({
                login: userName,
                password
            });
            props.history.push("/");
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <h2 className="global_title">Login</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Usuario</label>
                    <input id="login" type="text"
                        onChange={(event) => setUserName(event.target.value)}
                        className={errorHandler.getErrorClass("login", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("login")} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input id="password" type="password"
                        onChange={(event) => setPassword(event.target.value)}
                        className={errorHandler.getErrorClass("password", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("password")} />
                </div>

                <DangerLabel message={errorHandler.errorMessage} />

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={loginClick}>Login</button>
                    <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
                </div >
            </form >
        </div >
    );
}
