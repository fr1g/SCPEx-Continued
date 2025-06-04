export default class Pageable{
    // well, actually this is Page<>.
    total: number;
    content: any[];
    pageable: PageInfo;

    // getTotalPages(): number {
    //     if (this.total === 0) return 0;
    //     return Math.ceil(this.total / this.pageable.pageSize);
    // }

    constructor(total: number, content: any[], pageable: PageInfo){
        this.pageable = pageable;
        this.content = content;
        this.total = total;
    }
}

export class PageInfo{
    sort: SortInfo;
    pageNumber: number;
    pageSize: number;

    constructor(sort: SortInfo, pn: number, ps: number){
        this.sort = sort;
        this.pageSize = ps;
        this.pageNumber = pn;
    }
}

class SortInfo{
    orders: Order[];

    constructor(o: Order[]){
        this.orders = o;
    }
}

export class Order{
    // todo maybe not appliable?
    direction: "asc" | "desc";
    property: string;
    ignoreCase: boolean;
    nullHandling: string;

    constructor(dir: "asc" | "desc" | "ASC" | "DESC", prop: string, ic: boolean, nullHandle: string){
        this.direction = dir.toLowerCase() as "asc" | "desc";
        this.ignoreCase = ic;
        this.nullHandling = nullHandle;
        this.property = prop;
    }
}