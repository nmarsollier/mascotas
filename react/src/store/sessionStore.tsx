import { createStore } from "redux";
import * as userApi from "../api/userApi";
import { ILogin, ISignUpRequest, IUser } from "../api/userApi";

export interface IStoredState {
    token?: string;
    user?: IUser;
}

enum StoreAction {
    LOGIN, LOGOUT, USER_FETCH,
}

interface IAction {
    type: StoreAction;
    payload?: IStoredState;
}

const initialState: IStoredState = {
    token: userApi.getCurrentToken(),
    user: userApi.getCurrentUser(),
};

const sessionStore = createStore((state = initialState, action: IAction) => {
    switch (action.type) {
        case StoreAction.LOGIN:
            return {
                ...state,
                token: action.payload!.token,
            };
        case StoreAction.USER_FETCH:
            return {
                ...state,
                user: action.payload,
            };
        case StoreAction.LOGOUT:
            return {
                ...state,
                token: undefined,
                user: undefined,
            };
        default:
            return state;
    }
});

export async function login(payload: ILogin): Promise<IUser> {
    try {
        const data = await userApi.login(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.LOGIN,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.LOGOUT,
        });
        return Promise.reject(err);
    }
}

export async function newUser(payload: ISignUpRequest): Promise<IUser> {
    try {
        const data = await userApi.newUser(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.LOGIN,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.LOGOUT,
        });
        return Promise.reject(err);
    }
}

async function reloadCurrentUser(): Promise<IUser> {
    try {
        const data = await userApi.reloadCurrentUser();
        sessionStore.dispatch({
            payload: {
                user: data,
            },
            type: StoreAction.USER_FETCH,
        });
        return Promise.resolve(data);
    } catch (err) {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.LOGOUT,
        });
        return Promise.reject(err);
    }
}

export async function logout(): Promise<void> {
    try {
        await userApi.logout();
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.LOGOUT,
        });
        return Promise.resolve();
    } catch (error) {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.LOGOUT,
        });
        return Promise.resolve();
    }
}

if (userApi.getCurrentToken() !== undefined) {
    reloadCurrentUser().then();
}

export default sessionStore;
