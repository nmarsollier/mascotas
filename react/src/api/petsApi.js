import axios from "axios";
import { getCurrentToken } from "./userApi";

axios.defaults.headers.common["Content-Type"] = "application/json";

export function loadPets() {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/pet")
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
}

export function loadPet(id) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/pet/" + id)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
}

export function newPet(payload) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/pet", payload)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
}

export function savePet(payload) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/pet/" + payload.id, payload)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
}

export function deletePet(id) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.delete("http://localhost:3000/v1/pet/" + id)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        }
    });
}
