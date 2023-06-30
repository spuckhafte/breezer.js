import discord, { Message, PermissionResolvable } from 'discord.js';
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';
import { buttonSignal } from './helpers/funcs.js';
declare class Bot {
    commands: string[];
    bot: discord.Client;
    prefix: string;
    private commandObjects;
    private token;
    private cmdFolder;
    private lang;
    constructor(options: {
        commandsFolder: string;
        token: string;
        prefix: string;
        lang: '.js' | '.ts';
    });
    go(cb?: CallableFunction): Promise<void>;
}
/**Check if a user has a specific perm */
declare function userHasPerm(perm: PermissionResolvable, userId: string, msg: Message): Promise<boolean>;
export { Bot, Command, StateManager, buttonSignal, userHasPerm };
