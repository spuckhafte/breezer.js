import { err } from './funcs.js';
export const extractFieldValuesHandler = {
    'string': (data, strict, name) => {
        if (strict && !isNaN(data))
            console.log(err("the data provided is purely a number while the field is string type", name, true));
        return data;
    },
    'number': (data, strict, name) => {
        if (isNaN(data)) {
            if (strict)
                throw Error(err("Data provided for number type field is not a number", name));
            else
                return data;
        }
        return Number(data);
    }
};
export function revealNameOfCmd(content, prefix) {
    content = content.trim();
    if (!content.toLowerCase().startsWith(prefix))
        return false;
    return content.replace(prefix, '').replace(/[ ]+/g, ' ').trim().split(' ')[0].toLowerCase();
}
