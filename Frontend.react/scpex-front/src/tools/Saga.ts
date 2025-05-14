
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {slices as s} from './ReduceHelper.ts';
import { all } from 'redux-saga/effects';

const internal = s.internal.actions,
      warehouse = s.warehouseOperations.actions;  

export const sagas = {
    actInternal: function*(): any{
        try {
            let current: any = yield select((state) => state.internal.bucket) as unknown as any;
            yield call(() => console.log(current))
        } catch (error) {
            yield call(() => console.log("Error happened during SAGAS/ACTINTERNAL/"))
        }
    },

    warehouse: {
        updateSelectables: function* (){
            yield 
        }
    }
}

export const actionListeners = {
    watchInternal: function*(){
        yield takeEvery("internal/update", sagas.actInternal)
    },

    watchWarehouseUpdateSelectables: function* (){
        yield takeEvery("warehouse/updateSelectables", sagas.warehouse.updateSelectables)
    }
}

function obj2Arr(obj: any){
    let buffer: any[] = [];
    for(let n in obj){
        buffer.push(obj[n]);
    }
    return buffer;
}

export default function* rootSaga(){
    yield all([obj2Arr(actionListeners)])
}