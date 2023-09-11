import discord from 'discord.js';
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';
import { buttonSignal, userHasPerm } from './helpers/funcs.js';
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
export { Bot, Command, StateManager, buttonSignal, userHasPerm };
