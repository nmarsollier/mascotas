import axios from "axios";
import { getCurrentToken } from "./userApi";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IProvince {
    id: string;
    name: string;
}

export function getProvinces() {
    return new Promise<IProvince[]>((resolve, reject) => {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/province")
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}
