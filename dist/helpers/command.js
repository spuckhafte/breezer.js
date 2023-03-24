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
const regex = {
    stateOperateExp: /{{[a-zA-Z0-9$%+\-*/()\[\]<>?:="'^.! ]+}}/g,
    stateExp: /\$[a-zA-Z0-9-]+\$/g
};
class Command {
    constructor(settings) {
        this.content = '';
        this.till = 15;
        this.structure = settings.structure;
        this.name = settings.name;
        this.strict = !!settings.strict;
        this.states = settings.states;
        this.till = settings.till;
        if (settings.structure.length > 0) {
            let error = (0, funcs_1.err)("'nully' bit should be at last and present iff the structure size is more than 1", this.name);
            const nullCount = this.structure.filter(i => i.includes('null')).length;
            if ((nullCount == 1 && settings.structure.length == 1) ||
                (nullCount > 1 && this.structure.length > 1))
                throw Error(error);
        }
        if (!this.states)
            return;
        const stateChangeHandler = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.msg || !this.states || !this.msgPayload)
                return;
            if (typeof this.till === 'number' || typeof this.till === 'undefined') {
                if (typeof this.till === 'undefined')
                    this.till = 15;
                if (Date.now() - this.msg.createdTimestamp >= this.till * 60 * 1000) {
                    if (this.strict) {
                        let e = (0, funcs_1.err)(`a msg listening for states since ${this.msg.createdTimestamp} for ${this.till * 60 * 1000}ms got expired and is not listening now`, this.name, true);
                        console.log(e);
                    }
                    this.states.event.removeListener('stateChange', stateChangeHandler);
                    return;
                }
            }
            let oldPayLoadString = JSON.stringify(this.msgPayload);
            let newPayloadString = formatString(oldPayLoadString, this.states);
            if (oldPayLoadString == newPayloadString)
                return;
            let newPayload = typeof this.msgPayload == 'string'
                ? newPayloadString : JSON.parse(newPayloadString);
            try {
                yield this.msg.edit(newPayload);
            }
            catch (e) {
                if (this.strict) {
                    let er = (0, funcs_1.err)("a msg for this cmd got deleted, it was listening for state(s)", this.name, true);
                    console.log(er);
                }
                this.states.event.removeListener('stateChange', stateChangeHandler);
            }
        });
        this.states.event.on('stateChange', stateChangeHandler);
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
    reply(msg, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.msgPayload = payload;
            if (!this.states) {
                yield msg.reply(payload);
                return;
            }
            let data;
            if (typeof payload == 'string') {
                data = formatString(payload, this.states);
            }
            else {
                data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
            }
            this.msg = yield msg.reply(data);
        });
    }
    send(msg, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.msgPayload = payload;
            if (!this.states) {
                yield msg.reply(payload);
                return;
            }
            let data;
            if (typeof payload == 'string') {
                data = formatString(payload, this.states);
            }
            else {
                data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
            }
            this.msg = yield msg.channel.send(data);
        });
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
function formatString(text, states) {
    if (!checkForOperation(text))
        return stateExtracter(text, states);
    const operations = text.match(regex.stateOperateExp);
    //@ts-ignore - operations is not null, cause we are already checking for it (look up)
    for (let rawOperation of operations) {
        let operation = rawOperation.replace(/{{|}}/g, '');
        operation = stateExtracter(operation, states);
        let afterOperation;
        try {
            afterOperation = eval(operation);
        }
        catch (e) {
            console.error(`[err] Invalid State Operation:\n\n${rawOperation}\n\n${e}`);
        }
        if (typeof afterOperation == 'undefined')
            return text;
        text = text.replace(rawOperation, afterOperation);
    }
    return stateExtracter(text, states);
}
function stateExtracter(text, states) {
    const stateNames = text.match(regex.stateExp);
    if (stateNames) {
        for (let stateRaw of stateNames) {
            const state = stateRaw.replace(/\$/g, '');
            if (typeof states.states[state] == null)
                continue;
            let stateVal = states.get(state);
            if (typeof stateVal == 'object')
                stateVal = JSON.stringify(stateVal);
            text = text.replace(stateRaw, `${stateVal}`);
        }
    }
    return text;
}
function checkForOperation(text) {
    return regex.stateOperateExp.test(text);
}
