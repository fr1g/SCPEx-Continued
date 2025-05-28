import { Category } from "./Category";
import { GeneralStatus } from "./GeneralEnum";

export class Product {
    id: number;
    name: string;
    category: Category;
    status: GeneralStatus;
    barcode: string;
    singlePrice: number;
    size: string;
    weight: string;
    feature: string;
    amount: number;
    discount: number;
    warehouse: string; 
    note: string;

    constructor(
        id: number,
        name: string,
        category: Category,
        status: GeneralStatus,
        barcode: string,
        singlePrice: number,
        size: string,
        weight: string,
        feature: string,
        amount: number,
        discount: number,
        warehouse: string,
        note: string
    ) {
        this.id = id
        this.name = name
        this.category = category
        this.status = status
        this.barcode = barcode
        this.singlePrice = singlePrice
        this.size = size
        this.weight = weight
        this.feature = feature
        this.amount = amount
        this.discount = discount
        this.warehouse = warehouse
        this.note = note
    }
}