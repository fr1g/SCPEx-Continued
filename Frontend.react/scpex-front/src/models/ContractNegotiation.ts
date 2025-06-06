import User from "./UserType/User.ts"

export default class ContractNegotiation {
    id: number | null;
    title: string;
    description: string;
    dateCreated: string;
    sender: User | null;

    constructor(id: number | null = null, title: string, description: string, sender: User | null = null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dateCreated = new Date().toISOString();
        this.sender = sender;
    }
}
