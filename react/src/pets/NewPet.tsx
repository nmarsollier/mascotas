import React, { useEffect, useState } from "react";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";
import "../styles.css";
import { deletePet, loadPet, newPet, savePet } from "./api/petsApi";
import DangerLabel from "../common/components/DangerLabel";
import FormInput from "../common/components/FormInput";
import FormButtonBar from "../common/components/FormButtonBar";
import FormAcceptButton from "../common/components/FormAcceptButton";
import FormButton from "../common/components/FormButton";
import FormWarnButton from "../common/components/FormWarnButton";

export default function NewPet(props: DefaultProps) {
    const [birthDate, setBirthDate] = useState("")
    const [description, setDescription] = useState("")
    const [petId, setPetId] = useState("")
    const [name, setName] = useState("")

    const errorHandler = useErrorHandler()

    const loadPetById = async (id: string) => {
        if (id) {
            try {
                const result = await loadPet(id);
                setBirthDate(result.birthDate)
                setPetId(result.id)
                setName(result.name)
                setDescription(result.description)
            } catch (error) {
                errorHandler.processRestValidations(error);
            }
        }
    }
    const deleteClick = async () => {
        if (petId) {
            try {
                await deletePet(petId);
                props.history.push("/pets");
            } catch (error) {
                errorHandler.processRestValidations(error);
            }
        }
    }

    const saveClick = async () => {
        errorHandler.cleanRestValidations();
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío");
        }

        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            if (petId) {
                await savePet({ id: petId, name, birthDate, description });
            } else {
                await newPet({ id: petId, name, birthDate, description });
            }
            props.history.push("/pets");
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        const { id } = props.match.params;
        if (id) {
            loadPetById(id)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="global_content">
            <h2 className="global_title">Nueva Mascota</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <FormInput
                    label="Nombre"
                    name="name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Descripción"
                    name="description"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    errorHandler={errorHandler} />

                <FormInput
                    label="Fecha de Nacimiento"
                    name="birthDate"
                    value={birthDate}
                    onChange={event => setBirthDate(event.target.value)}
                    errorHandler={errorHandler} />

                <DangerLabel message={errorHandler.errorMessage} />

                <FormButtonBar>
                    <FormAcceptButton label="Guardar" onClick={saveClick} />

                    <FormWarnButton hidden={!petId} label="Eliminar" onClick={deleteClick} />

                    <FormButton label="Cancelar" onClick={() => goHome(props)} />

                </FormButtonBar>
            </form >
        </div>
    );
}
