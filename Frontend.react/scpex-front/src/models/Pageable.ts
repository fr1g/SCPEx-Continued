export default class Pageable{
    total: number;
    content: any[];
    pageable: PageInfo;

    constructor(total: number, content: any[], pageable: PageInfo){
        this.pageable = pageable;
        this.content = content;
        this.total = total;
    }
}

export class PageInfo{
    sort: SortInfo;
    paggeNumber: number;
    pageSize: number;

    constructor(sort: SortInfo, pn: number, ps: number){
        this.sort = sort;
        this.pageSize = ps;
        this.paggeNumber = pn;
    }
}

class SortInfo{
    orders: Order[];

    constructor(o: Order[]){
        this.orders = o;
    }
}

export class Order{
    direction: "ASC" | "DESC";
    property: string;
    ignoreCase: boolean;
    nullHandling: string;

    constructor(dir: "ASC" | "DESC", prop: string, ic: boolean, nullHandle: string){
        this.direction = dir;
        this.ignoreCase = ic;
        this.nullHandling = nullHandle;
        this.property = prop;
    }
}