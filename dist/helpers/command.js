var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { err } from "./handlers.js";
import { extractFieldValuesHandler, formatString } from "./handlers.js";
export class Command {
    constructor(settings) {
        this.content = '';
        this.till = 15;
        this.structure = settings.structure;
        this.name = settings.name;
        this.strict = !!settings.strict;
        this.states = settings.states;
        this.till = settings.till;
        if (settings.structure.length > 0) {
            let error = err("'nully' bit should be at last and present iff the structure size is more than 1", this.name);
            const nullCount = this.structure.filter(i => i.includes('null')).length;
            if ((nullCount == 1 && settings.structure.length == 1) ||
                (nullCount > 1 && this.structure.length > 1))
                if (this.strict)
                    throw Error(error);
        }
        if (!this.states)
            return;
        const stateChangeHandler = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.sent || !this.states || !this.msgPayload)
                return;
            if (typeof this.till === 'number' || typeof this.till === 'undefined') {
                if (typeof this.till === 'undefined')
                    this.till = 15;
                if (Date.now() - this.sent.createdTimestamp >= this.till * 60 * 1000) {
                    if (this.strict) {
                        let e = err(`a msg listening for states since ${this.sent.createdTimestamp} for ${this.till * 60 * 1000}ms got expired and is not listening now`, this.name, true);
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
                yield this.sent.edit(newPayload);
            }
            catch (e) {
                if (this.strict) {
                    let er = err("a msg for this cmd got deleted, it was listening for state(s)", this.name, true);
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
                throw Error(err("extracting from a field-less command.", this.name));
            if (this.structure.length !== fields.length) {
                if (this.structure[this.structure.length - 1].includes('null')) {
                    if ((this.structure.length - 1) !== fields.length)
                        throw Error(err("the fields does not match with structure.", this.name));
                }
                else
                    throw Error(err("the fields does not match with structure.", this.name));
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
                let data = extractFieldValuesHandler[this.structure[field].split('|')[0]](fields[field], this.strict, this.name);
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
    execute() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**Send using this if there are states to manage */
    reply(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.msgPayload = payload;
            if (!this.states) {
                yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.reply(payload));
                return;
            }
            let data;
            if (typeof payload == 'string') {
                data = formatString(payload, this.states);
            }
            else {
                data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
            }
            this.sent = yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.reply(data));
            return this.sent;
        });
    }
    /**Reply using this if there are states to manage */
    send(payload) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.msgPayload = payload;
            if (!this.states) {
                yield ((_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel.send(payload));
                return;
            }
            let data;
            if (typeof payload == 'string') {
                data = formatString(payload, this.states);
            }
            else {
                data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
            }
            this.sent = yield ((_b = this.msg) === null || _b === void 0 ? void 0 : _b.channel.send(data));
            return this.sent;
        });
    }
    /**Check if the bot has a specific perm */
    botHasPerm(perm) {
        var _a, _b;
        const channel = (_a = this.msg) === null || _a === void 0 ? void 0 : _a.channel;
        return (_b = channel.guild.members.me) === null || _b === void 0 ? void 0 : _b.permissionsIn(channel).has(perm);
    }
}
export class TypicalCommand extends Command {
    constructor() {
        super({
            structure: [],
            name: '_'
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
