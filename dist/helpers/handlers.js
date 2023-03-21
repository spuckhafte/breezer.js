"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revealNameOfCmd = exports.extractFieldValuesHandler = void 0;
const funcs_1 = require("./funcs");
exports.extractFieldValuesHandler = {
    'string': (data, strict, name) => {
        if (strict && !isNaN(data))
            console.log((0, funcs_1.err)("the data provided is purely a number while the field is string type", name, true));
        return data;
    },
    'number': (data, strict, name) => {
        if (isNaN(data)) {
            if (strict)
                throw Error((0, funcs_1.err)("Data provided for number type field is not a number", name));
            else
                return data;
        }
        return Number(data);
    }
};
function revealNameOfCmd(content, prefix) {
    content = content.trim();
    if (!content.startsWith(prefix))
        return false;
    return content.replace(prefix, '').replace(/[ ]+/g, ' ').trim().split(' ')[0];
}
exports.revealNameOfCmd = revealNameOfCmd;
