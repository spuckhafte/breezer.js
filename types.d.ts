import { MessagePayload, ReplyMessageOptions } from "discord.js";
import { states } from "./src/helpers/command";

export type Usage = ('message'|'server')[]
export type CmdStructure = 'string'|'number'|'string|null'|'number|null';

export type CommandSettings = {
    /**Define the structure of your command
     * - Like in this example: `r cal add 1 2`
     * - The structure can be: `['string', 'number', 'number']`
     * - structure is defined only for the fields that occur after cmd name. Here it is defined for 
     * `add 1 2`: `(string, number, number)`
     * - leave the structure array empty if you want to avoid this feature
     * - If structure is defined, you can use `.extract()` method to get the fields in sequence
     */
    structure:CmdStructure[],

    /**Your bot will throw errors in some specific cases like if a cmd doesn't match up 
     * with the structure defined for it.
     * - Only for development purposes, turn it off during production
    */
    strict?:boolean,

    /**name of the command*/
    name:string

    /**state instance */
    states?:states;
}

export type States = {
    [index: string]: any
}

export type Payload = string | MessagePayload | ReplyMessageOptions;