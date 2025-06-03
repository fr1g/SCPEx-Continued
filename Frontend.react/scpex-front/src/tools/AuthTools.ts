import { UserType } from "../models/GeneralEnum";
import { UserCredential } from "../models/UserCredential";
import User from "../models/UserType/User";
import { api } from './../axios/index.ts';
import { slices as s } from "./ReduceHelper.ts";
// import { User } from "../axios/models/user";

export function getUserCredential(): UserCredential | null {

    let triedCredentialGot

    if (false) return null;

    else {


        return new UserCredential('ForFrontTesting', "iadiuidsfie", "aminos@xx.aa");
    }
}

export function parseUser(source: User): UserCredential {
    console.log(source, " as source")
    let credential = new UserCredential(source.name, source.passwd!, source.contact);
    credential.id = source.id;
    credential.status = source.status;
    // console.log(source.type, UserType.CUSTOMER, ' type ex')
    credential.userType = ((source.type.toString() == UserType[UserType.CUSTOMER] || source.type.toString() == UserType[UserType.SELLER]) ? "trader" : "employee");
    credential.userClass = source.type.toString().toLowerCase();
    console.log(source.contact, 'by parser', source.type.toString().toLowerCase(), credential)
    return credential;
}

export function bear(token: string): string {
    return `Bearer ${token}`;
}

export async function checkToken(credential: UserCredential): Promise<boolean> { // checks if the current token is valid and same to the local saved credential info.
    if (credential.contact == null || credential.userClass == null) return false;


    let res = await api.Auth.getMe(credential.token);
    let userInfo = JSON.parse(res.content) as User;
    if (userInfo.id == credential.id && userInfo.contact == credential.contact && (userInfo.type).toString().toUpperCase() == credential.userClass.toUpperCase())
        return true;

    return false;
}

export function invalidCredentialHandler(error: Error | any, dispatchFunction: Function, navigateFunction: Function, handleKeywords = ['401']) {

    if (handleKeywords.some((e: string) => error.message.includes(e))) {
        dispatchFunction(s.auths.actions.loginFailure(null));
        localStorage.removeItem('credential');
        localStorage.jumpMessage = "Please login.";
        navigateFunction('/auth/login');
    }
}

export function insufficientHandler(navigateFunction: Function, message = "You don't have the permission to do so."){
    localStorage.jumpMessage = message
    navigateFunction('/');
}

export function isUserTrader(user: User){
    return ((user.type.toString() == UserType[UserType.CUSTOMER]) || (user.type.toString() == UserType[UserType.SELLER]));
}

export function isCredTrader(uc: UserCredential){
    return uc.userType == "trader";
}