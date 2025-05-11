
import { call, put, takeEvery } from 'redux-saga/effects';
import {slices as s} from './ReduceHelper.ts';
import { all } from 'redux-saga/effects';

const internal = s.internal,
      warehouseOperations = s.warehouseOperations;  

export const sagas = {
    
}

export const actionListeners = {
    watchInternal: function*(){
        yield takeEvery
    }
}

export default function* rootSaga(){
    yield all()
}