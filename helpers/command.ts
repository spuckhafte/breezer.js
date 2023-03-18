import { Message } from "discord.js";
import { CmdStructure, CommandSettings } from "../types";
import { err } from "./funcs";
import { extractFieldValuesHandler } from "./handlers";

export class Command {
    structure:CmdStructure[];
    name:string;
    strict:boolean;
    content:string='';
    msg?:Message;

    constructor(settings: CommandSettings) {
        this.structure = settings.structure;
        this.name = settings.name;
        this.strict = !!settings.strict;

        if (settings.structure.length > 0) {
            let error = err("'nully' bit should be at last and present iff the structure size is more than 1", this.name)
            const nullCount = this.structure.filter(i => i.includes('null')).length;
            if (
                (nullCount == 1 && settings.structure.length == 1) || 
                (nullCount > 1 && this.structure.length > 1)
            ) throw Error(error);
        }
    }

    /**Extract fields from a command as per their defined structure */
    extract() {
        const fields = this.content.split(' ');
        fields.shift();

        if (this.strict) {
            if (this.structure.length == 0)
                throw Error(err("extracting from a field-less command.", this.name));
            
            if (this.structure.length !== fields.length)
                throw Error(err("the fields does not match with structure.", this.name));
        }

        const extracted:(string|number)[] = [];
        for (let field in fields) {
            try {
                let data = extractFieldValuesHandler[
                    this.structure[field].split('|')[0] as 'number'|'string'
                ](fields[field], this.strict, this.name);

                extracted.push(data);
            } catch (e) {
                if (this.strict) {
                    throw Error(e as string);
                } else extracted.push(fields[field]);
            }
        }
        return extracted;   
    }

    /**Add your logics for the command inside this function */
    async execute(msg:Message) {}
}

export class TypicalCommand extends Command {
    constructor() {
        super({
            structure: [],
            name: '_'
        });
    }
    async execute(msg:Message) {
        
    }
}