import { Message } from "discord.js";
import { CmdStructure, CommandSettings, Payload } from "../../types";
import { StateManager } from "./stateManager.js";
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
    execute(): Promise<void>;
    /**Send using this if there are states to manage */
    reply(payload: Payload): Promise<Message<boolean> | undefined>;
    /**Reply using this if there are states to manage */
    send(payload: Payload): Promise<Message<boolean> | undefined>;
}
export declare class TypicalCommand extends Command {
    constructor();
    execute(): Promise<void>;
}
