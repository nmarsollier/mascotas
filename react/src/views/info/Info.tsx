import React from "react";
import { useSelector } from "react-redux";
import { IStoredState } from "../../store/sessionStore";
import FormLabel from "../../common/components/FormLabel";
import FormTitle from "../../common/components/FormTitle";
import Form from "../../common/components/Form";

export default function Info() {
    const user = useSelector((state: IStoredState) => state.user)
    const token = useSelector((state: IStoredState) => state.token)

    return (
        <div>
            <FormTitle>Información de Perfil</FormTitle>
            <Form>
                <FormLabel label="Login" text={user?.login} />
                <FormLabel label="Nombre" text={user?.name} />
                <FormLabel label="Permisos" text={user?.permissions.join(", ")} />
                <FormLabel label="Token" text={token} />
            </Form>
        </div>
    );
}
