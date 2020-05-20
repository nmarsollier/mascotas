import React, { useState } from "react";
import DangerLabel from "../common/components/DangerLabel";
import FormPassword from "../common/components/FormPassword";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import { DefaultProps, goHome } from "../common/utils/Tools";
import "../styles.css";
import { changePassword } from "./api/userApi";
import FormButtonBar from "../common/components/FormButtonBar";
import FormAcceptButton from "../common/components/FormAcceptButton";
import FormButton from "../common/components/FormButton";


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
                <FormPassword
                    label="Password Actual"
                    name="currentPassword"
                    errorHandler={errorHandler}
                    onChange={event => setCurrentPassword(event.target.value)} />

                <FormPassword
                    label="Nuevo Password"
                    name="newPassword"
                    errorHandler={errorHandler}
                    onChange={event => setNewPassword(event.target.value)} />

                <FormPassword
                    label="Repetir Password"
                    name="newPassword2"
                    errorHandler={errorHandler}
                    onChange={event => setNewPassword2(event.target.value)} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Cambiar" onClick={updatePasswordClick} />
                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </form >
        </div>
    );
}
