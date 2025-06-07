import { combineReducers, createSlice, UnknownAction } from "@reduxjs/toolkit";
import { parseUser } from "./AuthTools";
import { UserCredential } from "../models/UserCredential";

function tryGetCredentialsFromLocalStorage() {
    console.log('trying to get credentials from localStorage')
    try {
        let c = localStorage.credential;
        if(c) return JSON.parse(localStorage.credential);
        else return null;
    } catch (error) {
        console.log(error, ' failed to load')
        localStorage.removeItem('credential');
        return null;
    }
}


interface AuthStateTemplate {
    userInfo: UserCredential | null;
    registerResult: string | null;
}
const AuthDefaultState: AuthStateTemplate = {
    userInfo: tryGetCredentialsFromLocalStorage(),
    registerResult: null
}

export const slices = {

    globalModal: createSlice(
        {
            name: 'globalModal',
            initialState: {
                visible: false,
                title: '操作失败',
                message: '',
            },
            reducers: {
                showModal: (state, action) => {
                    const { title, message } = action.payload;
                    state.visible = true;
                    state.title = title || 'Info';
                    state.message = message;
                    console.log("new applied")
                },
                hideModal: (state) => {
                    state.visible = false;
                },
            }
        }
    ),
    auths: createSlice(
        {
            name: 'auth',
            initialState: AuthDefaultState,
            reducers: {
                login: (state, action) => {
                    console.log("Fired login: ", state, " ", action)
                },
                loginSuccess: (state, action) => {
                    // console.log(action)
                    state.userInfo = parseUser(JSON.parse((action.payload).content!));
                    console.log(state.userInfo, ' s');
                    localStorage.credential = JSON.stringify(state.userInfo);
                },
                loginFailure: (state, action) => {
                    console.log(action)
                    state.userInfo = null;
                    
                },
                register: (state, action) => {
                    console.log("Fired register: ", state, " ", action)
                },
                regFailure: (state, action) => {
                    console.log(action)
                    state.registerResult = action.payload;
                },
                regSuccess: (state, action) => {
                    console.log(action)
                    state.registerResult = action.payload;
                },
            }
        }
    ),
    
}

// generic operations
export const GET = "GET";
export const UPD = "UPD";
export const DEL = "DEL";
export const NEW = "NEW";

// export const login: loginAction = slices.auths.actions.login;