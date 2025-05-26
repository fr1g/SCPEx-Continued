import { UserCredential } from "../models/UserCredential";
import { User } from "../axios/models/user";

export function getUserCredential(): UserCredential | null{

    let triedCredentialGot

    if(false) return null;

    else{


        return new UserCredential('ForFrontTesting', "iadiuidsfie", "aminos@xx.aa");
    }
}

export function parseUser(source: User) : UserCredential{
    console.log(source, " as source")
    let credential = new UserCredential(source.name, source.passwd, source.contact);


    return credential;
}