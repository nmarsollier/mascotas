import React, { useState } from "react";
import { changePassword } from "./api/userApi";
import "../styles.css";
import ErrorLabel from "../common/components/ErrorLabel";
import useErrorHandler from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";
import DangerLabel from "../common/components/DangerLabel";


export default function Password(props: DefaultProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")

    const errorHandler = useErrorHandler()

    const updatePasswordClick = async () => {
        errorHandler.cleanRestValidations();

        if (!currentPassword) {
            errorHandler.addError("currentPassword", "No puede estar vacío");
        }
        if (!newPassword) {
            errorHandler.addError("newPassword", "No puede estar vacío");
        }
        if (newPassword !== newPassword2) {
            errorHandler.addError("newPassword2", "Las contraseñas no coinciden");
        }

        if (errorHandler.hasErrors()) {
            return
        }

        try {
            await changePassword({
                currentPassword,
                newPassword
            });
            props.history.push("/");
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    return (
        <div className="global_content">
            <h2 className="global_title">Cambiar Password</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Password Actual</label>
                    <input id="currentPassword" type="password"
                        onChange={event => setCurrentPassword(event.target.value)}
                        className={errorHandler.getErrorClass("currentPassword", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("currentPassword")} />
                </div>

                <div className="form-group">
                    <label>Nuevo Password</label>
                    <input id="newPassword" type="password"
                        onChange={event => setNewPassword(event.target.value)}
                        className={errorHandler.getErrorClass("newPassword", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("newPassword")} />
                </div>

                <div className="form-group">
                    <label>Repetir Password</label>
                    <input id="newPassword2" type="password"
                        onChange={event => setNewPassword2(event.target.value)}
                        className={errorHandler.getErrorClass("newPassword2", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("newPassword2")} />
                </div>

                <DangerLabel message={errorHandler.errorMessage} />

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={updatePasswordClick}>Cambiar</button>
                    <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
                </div >
            </form >
        </div>
    );
}
