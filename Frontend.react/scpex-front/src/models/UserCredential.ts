
export type employees = "admin" | "warehouse" | string;
export type traders = "seller" | "customer" | "hybrid";

export class UserCredential {
    id!: number;
    name!: string;
    userType!: "employee" | "trader";
    userClass!: employees | traders;
    isPrime?: boolean;
    status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7  = 0;
    createdDate!: Date;
    contact!: string;
    note?: string;

    token!: string;
    valid!: number; // until long timestamp maybe, unsure

    constructor(
        name: string,
        token: string,
        contact: string,

        id: number = 0,
        valid: number = -1,

        userType: "employee" | "trader" = "employee",
        userClass: employees | traders = "admin",

        createdDate: Date = new Date(Date.now()),
        isPrime: boolean = false,
        status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 0,
        note: string = ""
      ) {
        this.id = id;
        this.name = name;
        this.userType = userType;
        this.userClass = userClass;
        this.createdDate = createdDate;
        this.contact = contact;
        this.token = token;
        this.valid = valid;
        this.isPrime = isPrime;
        this.status = status;
        this.note = note;
      }

}

export function UserCredentialFactory(json: string){
    let obj = JSON.parse(json);
    console.log(obj);
    return obj as unknown as UserCredential;
}

export class TraderCredential extends UserCredential{
 // is this really necessary for the frontend?
}