import { createStore } from "redux";
import * as userApi from "../api/userApi";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const USER_FETCH = "USER_FETCH";
const NEW_USER = "NEW_USER";

export interface IStoredState {
    token?: string;
    user?: userApi.IUser;
}

export interface IAction {
    type: string;
    payload: any;
}

const initialState: IStoredState = {
    token: userApi.getCurrentToken(),
    user: userApi.getCurrentUser(),
};

const sessionStore = createStore((state = initialState, action: IAction) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                token: action.payload.token,
            };
        case NEW_USER:
            return {
                ...state,
                token: action.payload.token,
            };
        case USER_FETCH:
            return {
                ...state,
                user: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                token: undefined,
                user: undefined,
            };
        default:
            return state;
    }
});

export function login(payload: userApi.ILogin) {
    return new Promise((result, reject) => {
        userApi.login(payload)
            .then((data) => {
                sessionStore.dispatch({
                    payload: data,
                    type: LOGIN,
                });
                reloadCurrentUser()
                    .then((response) => { result(response); })
                    .catch((err) => { reject(err); });
            })
            .catch((err) => {
                sessionStore.dispatch({
                    payload: undefined,
                    type: LOGOUT,
                });
                reject(err);
            });
    });
}

export function newUser(payload: userApi.ISignUpRequest) {
    return new Promise((result, reject) => {
        userApi.newUser(payload)
            .then((data) => {
                sessionStore.dispatch({
                    payload: data,
                    type: NEW_USER,
                });
                reloadCurrentUser()
                    .then((response) => { result(response); })
                    .catch((err) => { reject(err); });
            })
            .catch((err) => {
                sessionStore.dispatch({
                    payload: undefined,
                    type: LOGOUT,
                });
                reject(err);
            });
    });
}

export function reloadCurrentUser() {
    return new Promise((result, reject) => {
        userApi.reloadCurrentUser()
            .then((data) => {
                sessionStore.dispatch({
                    payload: data,
                    type: USER_FETCH,
                });
                result(data);
            })
            .catch((err) => {
                sessionStore.dispatch({
                    payload: undefined,
                    type: LOGOUT,
                });
                reject(err);
            });
    });
}

export function logout() {
    return new Promise((result, reject) => {
        userApi.logout()
            .then((data) => {
                sessionStore.dispatch({
                    payload: undefined,
                    type: LOGOUT,
                });
                result();
            })
            .catch((err) => {
                sessionStore.dispatch({
                    payload: undefined,
                    type: LOGOUT,
                });
                reject(err);
            });
    });
}

if (userApi.getCurrentToken() !== undefined) {
    reloadCurrentUser().then();
}

export default sessionStore;
