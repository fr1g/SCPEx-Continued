import { GeneralStatus } from "../models/GeneralEnum";
import Pageable from "../models/Pageable";
import Selectable from "../models/Selectable";

export function parseNumber(num: string, method: 'int' | 'double' | true = 'double'){
    switch(method){
        case 'int':
            return parseInt(num);
        default:
            return parseFloat(num);
    }

}

export function getTotals(pageable: Pageable | null){
    if(pageable == null) return -2;
    if (pageable.total === 0) return 0;
    return Math.ceil(pageable.total / pageable.pageable.pageSize);
}

export function isOneOf(str: string, compares: string[]){
    if(!str || !compares) return false;
    return compares.some((e: string) => str.includes(e));
}

export const selectableGeneralStatus = [
        new Selectable(0, GeneralStatus[0]),
        new Selectable(1, GeneralStatus[1]),
        new Selectable(2, GeneralStatus[2]),
        new Selectable(3, GeneralStatus[3]),
        new Selectable(4, GeneralStatus[4]),
        new Selectable(5, GeneralStatus[5]),
    ]