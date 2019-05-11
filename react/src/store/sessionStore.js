import { createStore } from "redux"
import * as userApi from "../api/userApi"

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT"
const USER_FETCH = "USER_FETCH"
const NEW_USER = "NEW_USER"

const initialState = {
    token: userApi.getCurrentToken(),
    user: userApi.getCurrentUser()
};

const sessionStore = createStore((state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                token: action.payload.token
            }
        case NEW_USER:
            return {
                ...state,
                token: action.payload.token
            }
        case USER_FETCH:
            return {
                ...state,
                user: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                token: undefined,
                user: undefined
            }
        default:
            return state
    }
});

export function login(payload) {
    return new Promise((result, reject) => {
        userApi.login(payload)
            .then(data => {
                sessionStore.dispatch({
                    type: LOGIN,
                    payload: data
                })
                reloadCurrentUser()
                    .then(data => { result(data) })
                    .catch(err => { reject(err) })
            })
            .catch(err => {
                sessionStore.dispatch({
                    type: LOGOUT
                })
                reject(err)
            })
    })
}

export function newUser(payload) {
    return new Promise((result, reject) => {
        userApi.newUser(payload)
            .then(data => {
                sessionStore.dispatch({
                    type: NEW_USER,
                    payload: data
                })
                reloadCurrentUser()
                    .then(data => { result(data) })
                    .catch(err => { reject(err) })
            })
            .catch(err => {
                sessionStore.dispatch({
                    type: LOGOUT
                })
                reject(err)
            })
    })
}

export function reloadCurrentUser() {
    return new Promise((result, reject) => {
        userApi.reloadCurrentUser()
            .then(data => {
                sessionStore.dispatch({
                    type: USER_FETCH,
                    payload: data
                })
                result(data)
            })
            .catch(err => {
                sessionStore.dispatch({
                    type: LOGOUT,
                    payload: undefined
                })
                reject(err)
            })
    })
}

export function logout() {
    return new Promise((result, reject) => {
        userApi.logout()
            .then(data => {
                sessionStore.dispatch({
                    type: LOGOUT
                })
                result()
            })
            .catch(err => {
                sessionStore.dispatch({
                    type: LOGOUT
                })
                reject(err)
            })
    })
}

if (userApi.getCurrentToken() !== undefined) {
    reloadCurrentUser().then()
}

export default sessionStore
