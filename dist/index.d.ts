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
/**Check if the bot has a specific perm */
declare function hasPermInGuild(perm: PermissionResolvable, msg: Message): boolean | undefined;
declare function hasPermInChannel(perm: PermissionResolvable, msg: Message, userId?: string): Promise<boolean>;
export { Bot, Command, StateManager, buttonSignal, hasPermInChannel, hasPermInGuild };
