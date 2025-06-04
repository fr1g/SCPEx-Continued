import { GeneralStatus, UserType } from "../GeneralEnum";
import Employee from "./Employee";
import User from "./User";

export default class Trader extends User{

    registrar: number;
    preferJson?: string;
    locationJson?: string; 

        constructor(
            
            
            id: number,
            name: string,
            contact: string,
            type: UserType | number,
            status: GeneralStatus,
            createdDate: Date | number | string,
            birth: Date | number | string,
            passwd: string | null,
            registrar: number,
            note?: string
        ) {
            super(id, name, contact, type, status, createdDate, birth, passwd, note);
            this.registrar = registrar;
        }
}
                                                                                                                                