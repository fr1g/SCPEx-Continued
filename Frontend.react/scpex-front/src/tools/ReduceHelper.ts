import { combineReducers, createSlice, UnknownAction } from "@reduxjs/toolkit";
import Warehouse from "../models/Warehouse";
import { parseUser } from "./AuthTools";
import { UserCredential } from "../models/UserCredential";

interface AuthStateTemplate{
    userInfo: UserCredential | null;
    registerResult: string | null;
}
const AuthDefaultState: AuthStateTemplate = {
    userInfo: null,
    registerResult: null
}

export const slices = {
    internal: createSlice(
        {
            name: 'internal',
            initialState: {
                bucket: null
            },
            reducers: {
                update: (state, action) => {
                    state.bucket = action.payload;
                }
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
                    state.userInfo = parseUser(action.payload);
                },
                loginFailure: (state, action) => {
                    console.log(action)
                    state.userInfo = null;
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
    search: createSlice(
        {
            name: "search",
            initialState: {
                resultStack: []
            },
            reducers: {
                commitSearch: (state, action) => {
                    state.resultStack = action.payload;
                }
            }
        }
    ),
    warehouseOperations: createSlice(
        {
            name: 'warehouse',
            initialState: {
                currentWarehouse: (new Warehouse("", null)).o(),
                selectables: []
            },
            reducers: {
                updateSelectables: (s, a) => {
                    s.selectables = a.payload;
                },
                changeSelection: (s, a) => {
                    s.currentWarehouse = a.payload;
                },
                // no need for more.
            }
        }
    )
}

// generic operations
export const GET = "GET";
export const UPD = "UPD";
export const DEL = "DEL";
export const NEW = "NEW";

// export const login: loginAction = slices.auths.actions.login;