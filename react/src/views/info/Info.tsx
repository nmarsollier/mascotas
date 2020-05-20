import React from "react";
import { useSelector } from "react-redux";
import { IStoredState } from "../../store/sessionStore";
import FormLabel from "../../common/components/FormLabel";

export default function Info() {
    const user = useSelector((state: IStoredState) => state.user)
    const token = useSelector((state: IStoredState) => state.token)

    return (
        <div>
            <h2>Información de Perfil</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <FormLabel label="Login" text={user?.login} />
                <FormLabel label="Nombre" text={user?.name} />
                <FormLabel label="Permisos" text={user?.permissions.join(", ")} />
                <FormLabel label="Token" text={token} />
            </form>
        </div>
    );
}
