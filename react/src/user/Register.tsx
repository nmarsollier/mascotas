import React, { useState } from "react";
import { newUser } from "../store/sessionStore";
import "../styles.css";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";
import DangerLabel from "../common/components/DangerLabel";
import FormInput from "../common/components/FormInput";
import FormPassword from "../common/components/FormPassword";

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
                <FormInput
                    label="Login"
                    name="login"
                    value={login}
                    errorHandler={errorHandler}
                    onChange={e => setLogin(e.target.value)} />

                <FormInput
                    label="Usuario"
                    name="name"
                    value={name}
                    errorHandler={errorHandler}
                    onChange={e => setName(e.target.value)} />

                <FormPassword
                    label="Password"
                    name="password"
                    value={password}
                    errorHandler={errorHandler}
                    onChange={e => setPassword(e.target.value)} />

                <FormPassword
                    label="Repetir Password"
                    name="password2"
                    value={password2}
                    errorHandler={errorHandler}
                    onChange={e => setPassword2(e.target.value)} />

                <DangerLabel message={errorHandler.errorMessage} />

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={registerClick}>Registrarse</button>
                    <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
                </div >
            </form >
        </div>
    );
}
