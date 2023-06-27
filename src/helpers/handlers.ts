import { err } from './funcs.js'

export const extractFieldValuesHandler = {
    'string': (data:string, strict:boolean, name:string|undefined) => {
        if (strict && !isNaN(data as any)) 
            console.log(err("the data provided is purely a number while the field is string type", name, true))
        return data;
    },
    'number': (data:string, strict:boolean, name:string|undefined) => {
        if (isNaN(data as any)) {
            if (strict)
                throw Error(err("Data provided for number type field is not a number", name));
            else return data;
        }
        return Number(data);
    }
}

export function revealNameOfCmd(content:string, prefix:string) {
    content = content.trim();
    if (!content.startsWith(prefix)) return false;
    return content.replace(prefix, '').replace(/[ ]+/g, ' ').trim().split(' ')[0].toLowerCase();
}