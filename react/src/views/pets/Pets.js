import React from "react";
import { connect } from "react-redux";
import { loadPets } from "../../api/petsApi";
import '../../styles.css';
import CommonComponent from "../../tools/CommonComponent";

class StatePets extends CommonComponent {
    constructor(props) {
        super(props)

        this.editPetClick = this.editPetClick.bind(this)
        this.loadPets = this.loadPets.bind(this)
        this.newPetClick = this.newPetClick.bind(this)

        this.state = {
            pets: []
        }

        this.loadPets()
    }

    loadPets() {
        this.props.loadPets().then(result => {
            this.setState({
                pets: result
            })
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    editPetClick(petId) {
        this.props.history.push('/editPet/' + petId)
    }

    newPetClick() {
        this.props.history.push('/editPet')
    }

    render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Mascotas</h2>
                <table id="mascotas" class="table">
                    <head>
                        <tr>
                            <th> Nombre </th>
                            <th> Descripción </th>
                            <th> </th>
                        </tr>
                    </head>
                    <tbody>
                        {this.state.pets.map((pet, i) => {
                            return (
                                <tr key={i}>
                                    <td>{pet.name}</td>
                                    <td>{pet.description}</td>
                                    <td class="text">
                                        <img src="/assets/edit.png" alt="" name="editar" onClick={() => this.editPetClick(pet.id)} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="btn-group ">
                    <button className="btn btn-success" onClick={this.newPetClick} >Nueva Mascota</button >
                    <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                </div >
            </div>
        )
    }
}

const Pets = connect(
    null,
    (dispatch) => {
        return {
            loadPets: user => loadPets(user),
        };
    }
)(StatePets);

export default Pets