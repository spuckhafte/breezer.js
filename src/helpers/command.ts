import { Message, PermissionResolvable, TextChannel } from "discord.js";
import { CmdStructure, CommandSettings, Payload } from "../../types";
import { err } from "./handlers.js";
import { extractFieldValuesHandler, formatString } from "./handlers.js";
import { StateManager } from "./stateManager.js";

export class Command<Structure extends (string|number|null)[]> {
    structure:CmdStructure[];
    name?:string;
    strict:boolean;
    content:string='';
    msg?:Message;
    sent?:Message;
    states?:StateManager;
    msgPayload?:Payload;
    till?:'forever'|number = 15;

    constructor(settings: CommandSettings) {
        this.structure = settings.structure;
        this.name = settings.name;
        this.strict = !!settings.strict;
        this.states = settings.states;
        this.till = settings.till;

        if (settings.structure.length > 0) {
            let error = err("'nully' bit should be at last and present iff the structure size is more than 1", this.name)
            const nullCount = this.structure.filter(i => i.includes('null')).length;
            if (
                (nullCount == 1 && settings.structure.length == 1) || 
                (nullCount > 1 && this.structure.length > 1)
            ) if (this.strict) throw Error(error);
        }

        if (!this.states) return;

        const stateChangeHandler = async () => {
            if (!this.sent || !this.states || !this.msgPayload) return;

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

            if (oldPayLoadString == newPayloadString) return;

            let newPayload = typeof this.msgPayload == 'string' 
                            ? newPayloadString : JSON.parse(newPayloadString);

            try {
                await this.sent.edit(newPayload);
            } catch (e) {
                if (this.strict) {
                    let er = err("a msg for this cmd got deleted, it was listening for state(s)", this.name, true);
                    console.log(er);
                }
                this.states.event.removeListener('stateChange', stateChangeHandler);
            }
        }
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
                } else throw Error(err("the fields does not match with structure.", this.name));
            }
        }

        if (this.structure.length != 0 && this.structure[this.structure.length - 1].includes('null')) {
            if (fields.length == this.structure.length - 1) {
                if (fields[this.structure.length - 1] === undefined)
                    fields[this.structure.length - 1] = '';
            }
        }

        const extracted = [] as unknown as Structure;
        for (let field in fields) {
            try {
                if (+field == this.structure.length - 1 && +field !== fields.length - 1) {
                    if (this.structure[field].includes('string')) {
                        let value = fields.splice(+field).join(' ');
                        extracted.push(value as never);
                        return extracted;
                    }
                }

                let data = extractFieldValuesHandler[
                    this.structure[field].split('|')[0] as 'number'|'string'
                ](fields[field], this.strict, this.name);

                extracted.push(data as never);
            } catch (e) {
                if (this.strict) {
                    throw Error(e as string);
                } else extracted.push(fields[field] as never);
            }
        }
        return extracted;   
    }

    /**Add your logics for the command inside this function */
    async execute() {}

    /**Send using this if there are states to manage */
    async reply (payload:Payload) {
        this.msgPayload = payload;
        if (!this.states) {
            await this.msg?.reply(payload);
            return;
        }
        let data;
        if (typeof payload == 'string') {
            data = formatString(payload, this.states);
        } else {
            data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
        }
        this.sent = await this.msg?.reply(data);
        return this.sent;
    }

    /**Reply using this if there are states to manage */
    async send (payload:Payload) {
        this.msgPayload = payload;
        if (!this.states) {
            await this.msg?.channel.send(payload);
            return;
        }
        let data;
        
        if (typeof payload == 'string') {
            data = formatString(payload, this.states);
        } else {
            data = JSON.parse(formatString(JSON.stringify(this.msgPayload), this.states));
        }

        this.sent = await this.msg?.channel.send(data);
        return this.sent;
    }

    /**Check if the bot has a specific perm */
    botHasPerm(perm:PermissionResolvable) {
        const channel = this.msg?.channel as TextChannel;
        return channel.guild.members.me?.permissionsIn(channel).has(perm);
    }
}

export class TypicalCommand<T extends []> extends Command<T> {
    constructor() {
        super({
            structure: [],
            name: '_'
        });
    }
    async execute() {
        
    }
}