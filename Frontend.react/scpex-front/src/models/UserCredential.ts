
type employees = "admin" | "warehouse" | string;
type traders = "seller" | "customer" | "hybrid";

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
    valid!: number; // until long timestamp


    constructor(json: string){
        let obj = JSON.parse(json);
        console.log(obj);
    }

}

export class TraderCredential extends UserCredential{
 // is this really necessary for the frontend?
}