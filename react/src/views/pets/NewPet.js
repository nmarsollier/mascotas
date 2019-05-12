import React from "react";
import { connect } from "react-redux";
import { deletePet, savePet, newPet, loadPet } from "../../api/petsApi";
import '../../styles.css';
import CommonComponent from "../../tools/CommonComponent";
import ErrorLabel from "../../tools/ErrorLabel";

class StateNewPet extends CommonComponent {
    constructor(props) {
        super(props)

        this.saveClick = this.saveClick.bind(this)
        this.deleteClick = this.deleteClick.bind(this)

        this.state = {
            id: "",
            name: "",
            description: "",
            birthDate: "",
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params
        if (id) {
            loadPet(id).then(result => {
                this.setState(result)
            }).catch(error => {
                this.processRestValidations(error.response.data)
            })
        }
    }

    deleteClick() {
        if (this.state.id) {
            this.props.deletePet(this.state.id).then(result => {
                this.props.history.push('/pets')
            }).catch(error => {
                this.processRestValidations(error.response.data)
            })
        }
    }

    saveClick() {
        this.cleanRestValidations()
        if (!this.state.name) {
            this.addError("name", "No puede estar vacío")
        }

        if (this.hasErrors()) {
            this.forceUpdate()
            return
        }

        if (this.state.id) {
            this.props.savePet(this.state).then(result => {
                this.props.history.push('/pets')
            }).catch(error => {
                this.processRestValidations(error.response.data)
            })
        } else {
            this.props.newPet(this.state).then(result => {
                this.props.history.push('/pets')
            }).catch(error => {
                this.processRestValidations(error.response.data)
            })
        }
    }

    render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Nueva Mascota</h2>

                <form>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input id="name" type="text" value={this.state.name} onChange={this.updateState} className={this.getErrorClass("name", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('name')} />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <input id="description" type="text" value={this.state.description} onChange={this.updateState} className={this.getErrorClass("description", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('description')} />
                    </div>

                    <div className="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input id="birthDate" type="text" value={this.state.birthDate} onChange={this.updateState} className={this.getErrorClass("birthDate", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('birthDate')} />
                    </div>

                    <div hidden={!this.errorMessage} class="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.saveClick}>Guardar</button>
                        <button hidden={!this.state.id} className="btn btn-warning" onClick={this.deleteClick}>Eliminar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const NewPet = connect(
    null,
    (dispatch) => {
        return {
            deletePet: id => deletePet(id),
            newPet: pet => newPet(pet),
            savePet: pet => savePet(pet),
            loadPet: id => loadPet(id)
        };
    }
)(StateNewPet);

export default NewPet