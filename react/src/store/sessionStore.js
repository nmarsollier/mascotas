import { createStore } from "redux"
import * as userApi from "../api/userApi"

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT"
const USER_FETCH = "USER_FETCH"

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
    }
    return state
});

export function login(payload) {
    userApi.login(payload)
        .then(data => {
            sessionStore.dispatch({
                type: LOGIN,
                payload: data
            })
            reloadCurrentUser()
        })
        .catch(err => {
            sessionStore.dispatch({
                type: LOGOUT
            })
        })
}

export function reloadCurrentUser() {
    userApi.reloadCurrentUser()
        .then(data => {
            sessionStore.dispatch({
                type: USER_FETCH,
                payload: data
            })
        })
        .catch(err => {
            sessionStore.dispatch({
                type: LOGOUT,
                payload: undefined
            })
        })
}

export function logout() {
    userApi.logout()
        .then(data => {
            sessionStore.dispatch({
                type: LOGOUT
            })
        })
        .catch(err => {
            sessionStore.dispatch({
                type: LOGOUT
            })
        })
}

if (userApi.getCurrentToken() != undefined) {
    reloadCurrentUser()
}

export default sessionStore
