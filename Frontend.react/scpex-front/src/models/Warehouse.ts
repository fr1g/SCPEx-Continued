import Pageable from "./Pageable";

export default class Warehouse{ // which defines what will be returned from backend... the backend should apply for it
    uniqueName!: string;

    fetchedRecords: Pageable | null;

    // i really can no longer make each warehouse manageable safely... that's a pity.

    constructor(name: string, recs: Pageable | null){
        this.uniqueName = name;
        this.fetchedRecords = recs;
    }
}