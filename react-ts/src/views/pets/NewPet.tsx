import React from "react";
import { connect } from "react-redux";
import { deletePet, IPet, loadPet, newPet, savePet } from "../../api/petsApi";
import "../../styles.css";
import CommonComponent, { ICommonProps } from "../../tools/CommonComponent";
import ErrorLabel from "../../tools/ErrorLabel";

interface IProps extends ICommonProps {
    deletePet(id: string): Promise<void>;
    newPet(payload: IPet): Promise<IPet>;
    savePet(payload: IPet): Promise<IPet>;
    loadPet(id: string): Promise<IPet>;
}

interface IState {
    birthDate: string;
    description: string;
    id: string;
    name: string;
}

class StateNewPet extends CommonComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            birthDate: "",
            description: "",
            id: "",
            name: "",
        };
    }

    public componentDidMount() {
        const { id } = this.props.match.params;
        if (id) {
            loadPet(id).then((result) => {
                this.setState(result);
            }).catch((error) => {
                this.processRestValidations(error.response.data);
            });
        }
    }

    public deleteClick = () => {
        if (this.state.id) {
            this.props.deletePet(this.state.id).then((result) => {
                this.props.history.push("/pets");
            }).catch((error) => {
                this.processRestValidations(error.response.data);
            });
        }
    }

    public saveClick = () => {
        this.cleanRestValidations();
        if (!this.state.name) {
            this.addError("name", "No puede estar vacío");
        }

        if (this.hasErrors()) {
            this.forceUpdate();
            return;
        }

        if (this.state.id) {
            this.props.savePet(this.state).then((result) => {
                this.props.history.push("/pets");
            }).catch((error) => {
                this.processRestValidations(error.response.data);
            });
        } else {
            this.props.newPet(this.state).then((result) => {
                this.props.history.push("/pets");
            }).catch((error) => {
                this.processRestValidations(error.response.data);
            });
        }
    }

    public render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Nueva Mascota</h2>

                <form>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input id="name" type="text"
                            value={this.state.name}
                            onChange={this.updateState}
                            className={this.getErrorClass("name", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("name")} />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <input id="description" type="text"
                            value={this.state.description}
                            onChange={this.updateState}
                            className={this.getErrorClass("description", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("description")} />
                    </div>

                    <div className="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input id="birthDate" type="text"
                            value={this.state.birthDate}
                            onChange={this.updateState}
                            className={this.getErrorClass("birthDate", "form-control")}>
                        </input>
                        <ErrorLabel error={this.getErrorText("birthDate")} />
                    </div>

                    <div hidden={!this.errorMessage}
                        className="alert alert-danger"
                        role="alert">
                        {this.errorMessage}
                    </div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.saveClick}>Guardar</button>

                        <button hidden={!this.state.id}
                            className="btn btn-warning"
                            onClick={this.deleteClick}>Eliminar</button>

                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
                    </div >
                </form >
            </div>
        );
    }
}

const NewPet = connect(
    null,
    (dispatch) => {
        return {
            deletePet: (id: string) => deletePet(id),
            loadPet: (id: string) => loadPet(id),
            newPet: (pet: IPet) => newPet(pet),
            savePet: (pet: IPet) => savePet(pet),
        };
    },
)(StateNewPet);

export default NewPet;
