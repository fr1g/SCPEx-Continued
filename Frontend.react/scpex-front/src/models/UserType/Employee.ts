import { UserType, GeneralStatus } from "../GeneralEnum";
import User from "./User";

export default class Employee extends User {
    jobTitle: string;

    constructor(
        jobTitle: string, 
        
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
        this.jobTitle = jobTitle
    }
}