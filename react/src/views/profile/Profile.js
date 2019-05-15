import React from "react";
import { connect } from "react-redux";
import { updateBasicInfo, updateProfilePicture, getCurrentProfile, getPictureUrl } from "../../api/profileApi";
import { getProvinces } from "../../api/provincesApi";
import CommonComponent from "../../tools/CommonComponent";
import '../../styles.css';
import ImageUpload from "../../tools/ImageUpload";
import ErrorLabel from "../../tools/ErrorLabel";

class StateProfile extends CommonComponent {
    constructor(props) {
        super(props)

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

    uploadPicture = (image) => {
        this.props.updateProfilePicture({
            image: image
        }).then(result => {
            this.setState({
                picture: result.id
            })
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    updateClick = () => {
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

        this.props.updateBasicInfo(
            {
                name: this.state.name,
                province: this.state.province,
                email: this.state.email,
                address: this.state.address,
                phone: this.state.phone
            }
        ).then(result => {
            this.props.history.push('/')
        }).catch(error => {
            this.processRestValidations(error.response.data)
        })
    }

    render() {
        return (
            <div className="global_content">
                <h2 className="global_title">Actualizar Perfil</h2>

                <form>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input id="name" value={this.state.name} type="text" onChange={this.updateState} className={this.getErrorClass("name", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('name')} />
                    </div>

                    <div className="form-group">
                        <label>Profile Picture</label>
                        <ImageUpload src={getPictureUrl(this.state.picture)}
                            onChange={this.uploadPicture} />
                        <ErrorLabel error={this.getErrorText('name')} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input id="email" value={this.state.email} type="text" onChange={this.updateState} className={this.getErrorClass("email", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('email')} />
                    </div>

                    <div className="form-group">
                        <label>Provincia</label>
                        <select
                            value={this.state.province}
                            onChange={(e) => this.setState({ province: e.target.value })}
                            className={this.getErrorClass("email", "form-control")}>
                            {this.state.provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <ErrorLabel error={this.getErrorText('province')} />
                    </div>

                    <div className="form-group">
                        <label>Direcci&oacute;n</label>
                        <input id="address" value={this.state.address} type="text" onChange={this.updateState} className={this.getErrorClass("address", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('address')} />
                    </div>

                    <div className="form-group">
                        <label>Tel&eacute;fono</label>
                        <input id="phone" value={this.state.phone} type="text" onChange={this.updateState} className={this.getErrorClass("phone", "form-control")}></input>
                        <ErrorLabel error={this.getErrorText('phone')} />
                    </div>

                    <div hidden={!this.errorMessage} className="alert alert-danger" role="alert">{this.errorMessage}</div>

                    <div className="btn-group ">
                        <button className="btn btn-primary" onClick={this.updateClick}>Actualizar</button>
                        <button className="btn btn-light" onClick={this.goHome} >Cancelar</button >
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
            updateBasicInfo: user => updateBasicInfo(user),
            getCurrentProfile: _ => getCurrentProfile(),
            getProvinces: _ => getProvinces(),
            updateProfilePicture: payload => updateProfilePicture(payload),
            getPictureUrl: _ => getPictureUrl()
        };
    }
)(StateProfile);

export default Profile