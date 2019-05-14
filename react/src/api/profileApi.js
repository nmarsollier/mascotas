import axios from "axios"
import { getCurrentToken } from "./userApi";

axios.defaults.headers.common['Content-Type'] = 'application/json'

export function updateBasicInfo(payload) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/profile", payload)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        }
    })
}

export function updateProfilePicture(payload) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/profile/picture", payload)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        }
    })
}

export function getCurrentProfile() {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/profile")
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        }
    })
}

export function getPictureUrl(id) {
    return "http://localhost:3000/v1/image/" + id;
}
