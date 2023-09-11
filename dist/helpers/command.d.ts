import { Message, PermissionResolvable } from "discord.js";
import { CmdStructure, CommandSettings, Payload } from "../../types";
import { StateManager } from "./stateManager.js";
export declare class Command<Structure extends (string | number | null)[]> {
    structure: CmdStructure[];
    name?: string;
    strict: boolean;
    content: string;
    msg?: Message;
    sent?: Message;
    states?: StateManager;
    msgPayload?: Payload;
    till?: 'forever' | number;
    constructor(settings: CommandSettings);
    /**Extract fields from a command as per their defined structure */
    extract(): Structure;
    /**Add your logics for the command inside this function */
    execute(): Promise<void>;
    /**Send using this if there are states to manage */
    reply(payload: Payload): Promise<Message<boolean> | undefined>;
    /**Reply using this if there are states to manage */
    send(payload: Payload): Promise<Message<boolean> | undefined>;
    /**Check if the bot has a specific perm */
    botHasPerm(perm: PermissionResolvable): boolean | undefined;
}
export declare class TypicalCommand<T extends []> extends Command<T> {
    constructor();
    execute(): Promise<void>;
}
