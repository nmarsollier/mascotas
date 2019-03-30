import { createStore } from "redux"

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT"

const initialState = {
    user: undefined
};

const sessionStore = createStore((state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                user: undefined
            }
    }
    return state
});

export function login(payload) {
    sessionStore.dispatch({
        type: LOGIN,
        payload
    })
}

export function logout() {
    sessionStore.dispatch({
        type: LOGOUT
    })
}

export default sessionStore
