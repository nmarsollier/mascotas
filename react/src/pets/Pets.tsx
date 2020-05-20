import React, { useState, useEffect } from "react";
import { IPet, loadPets } from "./api/petsApi";
import "../styles.css";
import { useErrorHandler } from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";

export default function Pets(props: DefaultProps) {
    const [pets, setPets] = useState(new Array<IPet>())

    const errorHandler = useErrorHandler()

    const loadCurrentPets = async () => {
        try {
            const result = await loadPets();
            setPets(result);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const editPetClick = (petId: string) => {
        props.history.push("/editPet/" + petId);
    }

    const newPetClick = () => {
        props.history.push("/editPet");
    }

    useEffect(() => {
        loadCurrentPets()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="global_content">
            <h2 className="global_title">Mascotas</h2>
            <table id="mascotas" className="table">
                <thead>
                    <tr>
                        <th> Nombre </th>
                        <th> Descripción </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map((pet, i) => {
                        return (
                            <tr key={i}>
                                <td>{pet.name}</td>
                                <td>{pet.description}</td>
                                <td className="text">
                                    <img
                                        src="/assets/edit.png"
                                        alt=""
                                        onClick={() => editPetClick(pet.id)} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="btn-group ">
                <button className="btn btn-success" onClick={newPetClick} >Nueva Mascota</button >
                <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
            </div >
        </div>
    );
}
