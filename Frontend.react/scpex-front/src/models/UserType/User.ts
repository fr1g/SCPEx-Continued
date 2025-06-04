import { GeneralStatus, UserType } from "../GeneralEnum";

export default class User {
    id: number;
    name: string;
    contact: string;
    type: UserType | number;
    status: GeneralStatus;
    createdDate: Date | number | string;
    birth: Date | number | string;
    passwd: string | null;
    note?: string;

    constructor(
        id: number,
        name: string,
        contact: string,
        type: UserType | number,
        status: GeneralStatus,
        createdDate: Date | number | string,
        birth: Date | number | string,
        passwd: string | null,
        note?: string
    ) {
        this.id = id
        this.name = name
        this.contact = contact
        this.type = type
        this.status = status
        this.createdDate = createdDate
        this.birth = birth
        this.passwd = passwd
        this.note = note
    }
}