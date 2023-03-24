import { Message } from "discord.js";
import { CmdStructure, CommandSettings, Payload } from "../../types";
import { StateManager } from "./stateManager";
export declare class Command {
    structure: CmdStructure[];
    name?: string;
    strict: boolean;
    content: string;
    msg?: Message;
    states?: StateManager;
    msgPayload?: Payload;
    till?: 'forever' | number;
    constructor(settings: CommandSettings);
    /**Extract fields from a command as per their defined structure */
    extract(): (string | number)[];
    /**Add your logics for the command inside this function */
    execute(msg: Message): Promise<void>;
    reply(msg: Message, payload: Payload): Promise<void>;
    send(msg: Message, payload: Payload): Promise<void>;
}
export declare class TypicalCommand extends Command {
    constructor();
    execute(msg: Message): Promise<void>;
}
