
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import {slices as s} from './ReduceHelper.ts';
import { all } from 'redux-saga/effects';
import { LoginDataTransfer } from '../models/LoginDataTransfer.ts';
import { api } from '../axios/index.ts';
import { register } from 'module';
import { Operation } from '../models/Operation.ts';
import { title } from 'process';

const methods = {
    login: async function(info: LoginDataTransfer){
        console.log("fired login method inside")
        let res = await api.Auth.login(info);
        return res;
    },
    register: async function(info: Operation){ // for trader regist only
        if(localStorage.credential == null) throw new Error();
        let res = await 
            api.TraderManage.traderOperate(localStorage.credential.token, info);
        console.log("RES ", res)
        return res;
    }
}

export const sagas = {

    auth:{
        login: function* (act: any): any{
            try {
                document.getElementById("LoginButton")?.classList.add("loadingButton");
                document.getElementById("LoginButton")!.firstElementChild!.innerHTML = "...";

                let payload = act.payload;
                const userInfo = yield call(methods.login, payload);
                console.log(userInfo)
                yield put(s.auths.actions.loginSuccess(userInfo)); 

                document.getElementById("LoginButton")?.classList.remove("loadingButton");
                document.getElementById("LoginButton")!.firstElementChild!.innerHTML = "Login";

                localStorage.jumpMessage = "Successfully logged in!"
                
                window.location.replace("/user");
            } catch (error: any) {
                yield call(() => console.log(error.message, ' errpos1'))
                yield put(s.auths.actions.loginFailure(error.message)); 
                let revealedError = error.message;
                if(`${error.message}`.includes('401')) revealedError = "The requested account is disabled."
                else if(`${error.message}`.includes('40')) revealedError = "No such user matched with this user contact, or password incorrect."
                yield put(s.globalModal.actions.showModal({ 
                    title: "Error",
                    message: revealedError,
                }));

                document.getElementById("LoginButton")?.classList.remove("loadingButton");
                document.getElementById("LoginButton")!.firstElementChild!.innerHTML = "Login";
            }
        },
        register: function* (act: any): any{
            try {
                let payload = act.payload;
                const userInfo = yield call(methods.register, payload); // 调用 API
                console.log(userInfo)
                yield put(s.auths.actions.regSuccess(userInfo)); // 成功后更新状态
            } catch (error: any) {
                yield call(() => console.log(error, ' errpos2'))
                yield put(s.auths.actions.regFailure(error.message)); // 捕获错误
            }
        }
    }
}

export const actionListeners = {

    watchLogin: function* (){
        yield takeLatest(s.auths.actions.login.type, sagas.auth.login)
    }
}

export default function* rootSaga(){
    yield all([
        actionListeners.watchLogin()
    ]);
}