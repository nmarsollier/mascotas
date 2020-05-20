import React, { useEffect, useState } from "react";
import ErrorLabel from "../common/components/ErrorLabel";
import ImageUpload from "../common/components/ImageUpload";
import useErrorHandler from "../common/utils/ErrorHandler";
import { goHome, DefaultProps } from "../common/utils/Tools";
import { getProvinces, IProvince } from "../provinces/provincesApi";
import "../styles.css";
// tslint:disable-next-line:max-line-length
import { getCurrentProfile, getPictureUrl, updateBasicInfo, updateProfilePicture } from "./api/profileApi";
import DangerLabel from "../common/components/DangerLabel";

interface IState {
    name: string;
    province: string;
    email: string;
    address: string;
    phone: string;
    picture: string;
    provinces: IProvince[];
}

export default function Profile(props: DefaultProps) {
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [picture, setPicture] = useState("")
    const [province, setProvince] = useState("")
    const [provinces, setProvinces] = useState(new Array<IProvince>())

    const errorHandler = useErrorHandler()

    const loadProvinces = async () => {
        try {
            const result = await getProvinces();
            setProvinces(result);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const loadProfile = async () => {
        try {
            const result = await getCurrentProfile();

            setAddress(result.address)
            setEmail(result.email)
            setName(result.name)
            setPhone(result.phone)
            setPicture(result.picture)
            setProvince(result.province)

        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const uploadPicture = async (image: string) => {
        try {
            const result = await updateProfilePicture({
                image,
            });
            setPicture(result.id);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    const updateClick = async () => {
        errorHandler.cleanRestValidations();
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío");
        }
        if (!email) {
            errorHandler.addError("email", "No puede estar vacío");
        }
        if (errorHandler.hasErrors()) {
            return;
        }

        try {
            await updateBasicInfo({
                address,
                email,
                name,
                phone,
                province,
            });
            goHome(props);
        } catch (error) {
            errorHandler.processRestValidations(error);
        }
    }

    useEffect(() => {
        loadProvinces();
        loadProfile();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="global_content">
            <h2 className="global_title">Actualizar Perfil</h2>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input id="name" type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={errorHandler.getErrorClass("name", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("name")} />
                </div>

                <div className="form-group">
                    <label>Profile Picture</label>
                    <ImageUpload src={getPictureUrl(picture)}
                        onChange={uploadPicture} />
                    <ErrorLabel message={errorHandler.getErrorText("name")} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input id="email" type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={errorHandler.getErrorClass("email", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("email")} />
                </div>

                <div className="form-group">
                    <label>Provincia</label>
                    <select
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        className={errorHandler.getErrorClass("email", "form-control")}>
                        {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ErrorLabel message={errorHandler.getErrorText("province")} />
                </div>

                <div className="form-group">
                    <label>Dirección</label>
                    <input id="address" type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className={errorHandler.getErrorClass("address", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("address")} />
                </div>

                <div className="form-group">
                    <label>Tel&eacute;fono</label>
                    <input id="phone" type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={errorHandler.getErrorClass("phone", "form-control")}>
                    </input>
                    <ErrorLabel message={errorHandler.getErrorText("phone")} />
                </div>

                <DangerLabel message={errorHandler.errorMessage} />

                <div className="btn-group ">
                    <button className="btn btn-primary" onClick={updateClick}>Actualizar</button>
                    <button className="btn btn-light" onClick={() => goHome(props)} >Cancelar</button >
                </div >
            </form >
        </div>
    );
}
