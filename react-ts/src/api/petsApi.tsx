import axios from "axios";
import { getCurrentToken } from "./userApi";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IPet {
    id: string;
    name: string;
    birthDate: string;
    description: string;
}

export function loadPets() {
    return new Promise<IPet[]>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/pet")
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function loadPet(id: string) {
    return new Promise<IPet>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/pet/" + id)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function newPet(payload: IPet) {
    return new Promise<IPet>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/pet", payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function savePet(payload: IPet) {
    return new Promise<IPet>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/pet/" + payload.id, payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export function deletePet(id: string) {
    return new Promise<void>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.delete("http://localhost:3000/v1/pet/" + id)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}
