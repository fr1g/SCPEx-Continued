
export function Gen(salt?: string, length: number = 16): string{

    let buffer = '';

    for(let x = 0; x < length; x++){
        if(salt == null || salt == undefined || salt == '')
            buffer += `${Math.random() * 33}`[Math.floor(Math.random() * 10)] ?? 'x';
        else
            buffer += salt[Math.floor(Math.random() * 10) % salt.length] ?? 'x';
    }


    return buffer;

}