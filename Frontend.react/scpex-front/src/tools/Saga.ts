
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import {slices as s} from './ReduceHelper.ts';
import { all } from 'redux-saga/effects';
import { LoginDataTransfer } from '../models/LoginDataTransfer.ts';
import createConf from './ApiHelper.ts';
import { DefaultApi } from '../axios/api.ts';

type AnyAction = {type: string, [key: string]: any}

const methods = {
    login: function(info: LoginDataTransfer){
        console.log("fired login method inside")
        let conf = createConf();
        const loginApi = new DefaultApi(conf);
        let res = loginApi.apiAuthLoginPost(JSON.stringify(info));
        console.log("RES ", res)
        return res;
    }
}

// const internal = s.internal.actions,
//       warehouse = s.warehouseOperations.actions;  

export const sagas = {
    actInternal: function*(): any{
        try {
            let current: any = yield select((state) => state.internal.bucket) as unknown as any;
            // yield 1
            yield call(() => console.log(current))
        } catch (error) {
            yield call(() => console.log("Error happened during SAGAS/ACTINTERNAL/"))
        }
    },

    warehouse: { // combined
        updateSelectables: function* (): any{
            yield call(() => console.log("?"))
        }
    },

    auth:{
        login: function* (act: any): any{
            console.log(111);
            try {
                let payload = act.payload;
                console.log(payload, " pay");
                let n = methods.login(payload);
                console.log("nnn ", n)
                const userInfo = yield call(methods.login, payload); // 调用 API

                yield put(s.auths.actions.loginSuccess(userInfo)); // 成功后更新状态
            } catch (error: any) {
                yield call(() => console.log(error))
                yield put(s.auths.actions.loginFailure(error.message)); // 捕获错误
            }
        }
    }
}

export const actionListeners = {
    watchInternal: function*(){
        yield takeEvery("internal/update", sagas.actInternal)
    },

    watchWarehouseUpdateSelectables: function* (){
        yield takeEvery("warehouse/updateSelectables", sagas.warehouse.updateSelectables)
    }, 

    watchLogin: function* (){
        yield takeLatest("auths/login", sagas.auth.login)
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
    yield all([
        actionListeners.watchInternal(),
        actionListeners.watchWarehouseUpdateSelectables(),
        actionListeners.watchLogin()
    ]);
}