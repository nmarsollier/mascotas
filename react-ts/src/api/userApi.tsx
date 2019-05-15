import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

export function getCurrentToken(): string | undefined {
    const result = localStorage.getItem("token");
    return result ? result : undefined;
}

function setCurrentToken(token: string) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common.Authorization = "bearer " + token;
}

export function getCurrentUser(): IUser | undefined {
    return (localStorage.getItem("user") as unknown) as IUser;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return new Promise<void>((resolve, reject) => {
        axios.get("http://localhost:3000/v1/user/signout")
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface ILogin {
    login: string;
    password: string;
}

export interface IToken {
    token: string;
}

export function login(payload: ILogin) {
    return new Promise<IToken>((resolve, reject) => {
        axios.post("http://localhost:3000/v1/user/signin",
            payload)
            .then((res) => {
                setCurrentToken(res.data.token);
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export interface IUser {
    id: string;
    name: string;
    login: string;
    permissions: string[];
}

export function reloadCurrentUser() {
    return new Promise<IUser>((resolve, reject) => {
        if (getCurrentToken()) {
            axios.get("http://localhost:3000/v1/users/current")
                .then((res) => {
                    localStorage.setItem("user", res.data);
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export interface ISignUpRequest {
    name: string;
    password: string;
    login: string;
}

export function newUser(payload: ISignUpRequest) {
    return new Promise<IToken>((resolve, reject) => {
        if (getCurrentToken()) {
            axios.post("http://localhost:3000/v1/user", payload)
                .then((res) => {
                    setCurrentToken(res.data.token);
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

export interface IChangePassword {
    newPassword: string;
    currentPassword: string;
}

export function changePassword(payload: IChangePassword) {
    return new Promise((resolve, reject) => {
        if (getCurrentToken()) {
            axios.post("http://localhost:3000/v1/user/password", payload)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

if (getCurrentToken()) {
    setCurrentToken(getCurrentToken() as string);
}
