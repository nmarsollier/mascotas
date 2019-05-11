import React from "react";
import { connect } from "react-redux";
import { saveProfile, getCurrentProfile } from "../../api/profileApi";
import { getProvinces } from "../../api/provincesApi";
import ErrorComponent from "../../tools/ErrorComponent";
import './Profile.css';

class StateProfile extends ErrorComponent {
    constructor(props) {
        super(props)

        this.updateClick = this.updateClick.bind(this)
        this.cancelClick = this.cancelClick.bind(this)
        this.updateState = this.updateState.bind(this);

        this.state = {
            name: "",
            province: "",
            email: "",
            address: "",
            phone: "",
            picture: "",
            provinces: []
        }

        this.getProvinces()
        this.loadProfile()
    }

    getProvinces() {
        this.props.getProvinces().then(result => {
            this.setState({
                provinces: result
            })
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    loadProfile() {
        this.props.getCurrentProfile().then(result => {
            this.setState(result)
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    updateClick() {
        this.cleanRestValidations()
        if (!this.state.name) {
            this.addError("name", "No puede estar vacío")
        }
        if (!this.state.email) {
            this.addError("email", "No puede estar vacío")
        }
        if (this.hasErrors()) {
            this.forceUpdate()
            return
        }

        this.props.saveProfile(
            {
                name: this.state.name,
                province: this.state.province,
                email: this.state.email,
                address: this.state.address,
                phone: this.state.phone,
                picture: this.state.picture
            }
        ).then(result => {
            this.props.history.push('/')
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    cancelClick() {
        this.props.history.push('/')
    }

    render() {
        return (
            <div className="profile_content">
                <h2 className="global_title">Actualizar Perfil</h2>

                <form>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input id="name" value={this.state.name} type="text" onChange={this.updateState} className={this.getErrorClass("name", "form-control")}></input>
                        <div hidden={!this.getErrorText('name')} class="invalid-feedback">{this.getErrorText('name')}</div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input id="email" value={this.state.email} type="text" onChange={this.updateState} className={this.getErrorClass("email", "form-control")}></input>
                        <div hidden={!this.getErrorText('email')} class="invalid-feedback">{this.getErrorText('email')}</div>
                    </div>

                    <div className="form-group">
                        <label>Provincia</label>
                        <select
                            value={this.state.province}
                            onChange={(e) => this.setState({ province: e.target.value })}
                            className={this.getErrorClass("email", "form-control")}>
                            {this.state.provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div hidden={!this.getErrorText('province')} class="invalid-feedback">{this.getErrorText('province')}</div>
                    </div>

                    <div className="form-group">
                        <label>Direcci&oacute;n</label>
                        <input id="address" value={this.state.address} type="text" onChange={this.updateState} className={this.getErrorClass("address", "form-control")}></input>
                        <div hidden={!this.getErrorText('address')} class="invalid-feedback">{this.getErrorText('address')}</div>
                    </div>

                    <div className="form-group">
                        <label>Tel&eacute;fono</label>
                        <input id="phone" value={this.state.phone} type="text" onChange={this.updateState} className={this.getErrorClass("phone", "form-control")}></input>
                        <div hidden={!this.getErrorText('phone')} class="invalid-feedback">{this.getErrorText('phone')}</div>
                    </div>

                    <div hidden={!this.errorMessage} class="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.updateClick}>Actualizar</button>
                        <button className="btn btn-light" onClick={this.cancelClick} >Cancel</button >
                    </div >
                </form >
            </div>
        )
    }
}

const Profile = connect(
    null,
    (dispatch) => {
        return {
            saveProfile: user => saveProfile(user),
            getCurrentProfile: _ => getCurrentProfile(),
            getProvinces: _ => getProvinces()
        };
    }
)(StateProfile);

export default Profile