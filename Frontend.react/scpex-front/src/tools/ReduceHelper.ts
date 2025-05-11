import { combineReducers, createSlice, UnknownAction } from "@reduxjs/toolkit";
import Warehouse from "../models/Warehouse";

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
    warehouseOperations: createSlice(
        {
            name: 'warehouse',
            initialState: {
                currentWarehouse: new Warehouse("", null),
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

