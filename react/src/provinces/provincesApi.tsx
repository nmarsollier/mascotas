import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface Province {
    id: string;
    name: string;
}

export async function getProvinces(): Promise<Province[]> {
    try {
        const res = await axios.get("http://localhost:3000/v1/province");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}
