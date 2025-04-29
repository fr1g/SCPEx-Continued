import { GeneralStatus, UserType } from "../GeneralEnum";
import User from "./User";

export default class Trader extends User{


        constructor(
            
            
            id: number,
            name: string,
            contact: string,
            type: UserType,
            status: GeneralStatus,
            createdDate: Date | number | string,
            birth: Date | number | string,
            passwd: string | null,
            note?: string
        ) {
            super(id, name, contact, type, status, createdDate, birth, passwd, note);
            
        }
}
                                                                                                                                