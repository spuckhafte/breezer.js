import discord, { Intents } from 'discord.js';
import fs from 'fs';
import { TypicalCommand } from './helpers/command.js';
import { revealNameOfCmd } from './helpers/handlers.js';
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';

class Bot {
    commands:string[]; 
    bot:discord.Client;
    prefix:string;
    private commandObjects:{ [index: string]: TypicalCommand };
    private token:string;
    private cmdFolder:string;
    private lang:string

    constructor(options:{ commandsFolder:string, token:string, prefix:string, lang:'.js'|'.ts' }) {
        let intents = [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.MESSAGE_CONTENT,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
        ]

        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace(options.lang, ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;
        this.lang = options.lang;

        this.bot = new discord.Client({ intents });

        let cmdsCollectd:{ [index: string]: TypicalCommand } = {};
        for (let command of this.commands) {
            import(`file://${process.cwd()}/${this.cmdFolder}/${command}${this.lang}`).then(cmd => {
                if (cmd.default)
                    cmdsCollectd[command] = cmd.default;
            }).catch(e => console.log(e));
        }
        this.commandObjects = cmdsCollectd;
    }

    async login(cb?:CallableFunction) {
        await this.bot.login(this.token);
        if (cb) cb();
    }

    start() {
        this.bot.on('messageCreate', async msg => {
            const cmdName = revealNameOfCmd(msg.content, this.prefix);
            if (!cmdName || !this.commands.includes(cmdName)) return;
            let cmdClass = this.commandObjects[cmdName] as any;
            const cmd = new cmdClass() as TypicalCommand
            cmd.content = msg.content.replace(this.prefix, '').replace(/[ ]+/g, ' ').trim();
            cmd.execute(msg);
        });
    }
}

export { Bot, Command, StateManager };