import { GeneralStatus } from "./GeneralEnum";

export class Category {
    id: number;
    name: string;
    zone: string;
    note: string;
    status: GeneralStatus;

    constructor(
        id: number,
        name: string,
        zone: string,
        note: string,
        status: GeneralStatus
    ) {
        this.id = id
        this.name = name
        this.zone = zone
        this.note = note
        this.status = status
    }
}