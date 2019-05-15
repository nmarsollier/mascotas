import axios from "axios";
import { getCurrentToken } from "./userApi";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IProfile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    picture: string;
}

export interface IUpdateBasicProfile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
}

export function updateBasicInfo(payload: IUpdateBasicProfile) {
    return new Promise<IProfile>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/profile", payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export interface IUpdateProfileImage {
    image: string;
}
export interface IUpdateProfileImageId {
    id: string;
}

export function updateProfilePicture(payload: IUpdateProfileImage) {
    return new Promise<IUpdateProfileImageId>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/profile/picture", payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function getCurrentProfile() {
    return new Promise<IProfile>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/profile")
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function getPictureUrl(id: string) {
    return "http://localhost:3000/v1/image/" + id;
}
