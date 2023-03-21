"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypicalCommand = exports.Command = void 0;
const funcs_1 = require("./funcs");
const handlers_1 = require("./handlers");
class Command {
    constructor(settings) {
        this.content = '';
        this.structure = settings.structure;
        this.name = settings.name;
        this.strict = !!settings.strict;
        if (settings.structure.length > 0) {
            let error = (0, funcs_1.err)("'nully' bit should be at last and present iff the structure size is more than 1", this.name);
            const nullCount = this.structure.filter(i => i.includes('null')).length;
            if ((nullCount == 1 && settings.structure.length == 1) ||
                (nullCount > 1 && this.structure.length > 1))
                throw Error(error);
        }
    }
    /**Extract fields from a command as per their defined structure */
    extract() {
        const fields = this.content.split(' ');
        fields.shift();
        if (this.strict) {
            if (this.structure.length == 0)
                throw Error((0, funcs_1.err)("extracting from a field-less command.", this.name));
            if (this.structure.length !== fields.length) {
                if (this.structure[this.structure.length - 1].includes('null')) {
                    if ((this.structure.length - 1) !== fields.length)
                        throw Error((0, funcs_1.err)("the fields does not match with structure.", this.name));
                }
                else
                    throw Error((0, funcs_1.err)("the fields does not match with structure.", this.name));
            }
        }
        if (this.structure.length != 0 && this.structure[this.structure.length - 1].includes('null')) {
            if (fields.length == this.structure.length - 1) {
                if (fields[this.structure.length - 1] === undefined)
                    fields[this.structure.length - 1] = '';
            }
        }
        const extracted = [];
        for (let field in fields) {
            try {
                if (+field == this.structure.length - 1 && +field !== fields.length - 1) {
                    if (this.structure[field].includes('string')) {
                        let value = fields.splice(+field).join(' ');
                        extracted.push(value);
                        return extracted;
                    }
                }
                let data = handlers_1.extractFieldValuesHandler[this.structure[field].split('|')[0]](fields[field], this.strict, this.name);
                extracted.push(data);
            }
            catch (e) {
                if (this.strict) {
                    throw Error(e);
                }
                else
                    extracted.push(fields[field]);
            }
        }
        return extracted;
    }
    /**Add your logics for the command inside this function */
    execute(msg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Command = Command;
class TypicalCommand extends Command {
    constructor() {
        super({
            structure: [],
            name: '_'
        });
    }
    execute(msg) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.TypicalCommand = TypicalCommand;
