import discord from 'discord.js';
import fs from 'fs';
import { TypicalCommand } from './helpers/command.js';
import { revealNameOfCmd } from './helpers/handlers.js';
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';
import { buttonSignal, getIntents, userHasPerm } from './helpers/funcs.js';

class Bot {
    commands:string[]; 
    bot:discord.Client;
    prefix:string;
    intents?: number[];

    private commandObjects:{ [index: string]: TypicalCommand<[]> };
    private token:string;
    private cmdFolder:string;
    private lang:string

    constructor(options:{ commandsFolder:string, token:string, prefix:string, lang:'.js'|'.ts', intents?: number }) {

        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace(options.lang, ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;
        this.lang = options.lang;

        this.bot = new discord.Client({ intents: this.intents ?? getIntents() });

        let cmdsCollectd:{ [index: string]: TypicalCommand<[]> } = {};
        for (let command of this.commands) {
            const cmdPath = `file://${process.cwd()}/${this.cmdFolder}/${command}${this.lang}`;
            import(cmdPath).then(cmd => {
                if (cmd.default)
                    cmdsCollectd[command] = cmd.default;
            }).catch(e => console.log(e));
        }
        this.commandObjects = cmdsCollectd;
    }

    async go(cb?:CallableFunction) {
        await this.bot.login(this.token);
        this.bot.on('messageCreate', async msg => {
            msg.content = msg.content.toLowerCase();
            const cmdName = revealNameOfCmd(msg.content, this.prefix);

            if (!cmdName || !this.commands.includes(cmdName)) return;
            let cmdClass = this.commandObjects[cmdName] as any;
            const cmd = new cmdClass();

            cmd.content = msg.content.replace(this.prefix, '').replace(/[ ]+/g, ' ').trim();
            cmd.msg = msg;
            cmd.execute();
        });
        if (cb) cb();
    }
}


export { Bot, Command, StateManager, buttonSignal, userHasPerm };