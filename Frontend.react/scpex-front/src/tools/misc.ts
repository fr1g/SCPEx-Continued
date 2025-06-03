export function parseNumber(num: string, method: 'int' | 'double' | true = 'double'){
    switch(method){
        case 'int':
            return parseInt(num);
        default:
            return parseFloat(num);
    }

}