import { GeneralStatus } from "../models/GeneralEnum";
import Selectable from "../models/Selectable";

export function parseNumber(num: string, method: 'int' | 'double' | true = 'double'){
    switch(method){
        case 'int':
            return parseInt(num);
        default:
            return parseFloat(num);
    }

}


export const selectableGeneralStatus = [
        new Selectable(0, GeneralStatus[0]),
        new Selectable(1, GeneralStatus[1]),
        new Selectable(2, GeneralStatus[2]),
        new Selectable(3, GeneralStatus[3]),
        new Selectable(4, GeneralStatus[4]),
        new Selectable(5, GeneralStatus[5]),
    ]