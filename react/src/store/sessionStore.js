import { createStore } from "redux"
import axios from "axios";

axios.defaults.headers.common['Content-Type'] = 'application/json'

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT"
const USER_FETCH = "USER_FETCH"

const initialState = {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user')
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
    axios.post("http://localhost:3000/v1/user/signin",
        payload)
        .then(res => {
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = "bearer " + res.data.token;
            sessionStore.dispatch({
                type: LOGIN,
                payload: res.data
            })

            reloadCurrentUser()
        })
        .catch(err => {
            console.log(err);
            sessionStore.dispatch({
                type: LOGOUT
            })
        });
}

export function reloadCurrentUser() {
    if (sessionStore.getState().token != undefined) {
        axios.get("http://localhost:3000/v1/users/current")
            .then(res => {
                localStorage.setItem('user', res.data);

                sessionStore.dispatch({
                    type: USER_FETCH,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log(err);
                sessionStore.dispatch({
                    type: LOGOUT,
                    payload: undefined
                })
            })
    }
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStore.dispatch({
        type: LOGOUT
    })
}

if (sessionStore.getState().token != undefined) {
    axios.defaults.headers.common['Authorization'] = "bearer " + sessionStore.getState().token;
    reloadCurrentUser()
}

export default sessionStore
