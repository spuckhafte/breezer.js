import discord, { Intents } from 'discord.js';
import fs from 'fs';
import { TypicalCommand } from './helpers/command';
import { revealNameOfCmd } from './helpers/handlers';

class Bot {
    commands:string[]; 
    bot:discord.Client;
    prefix:string;
    private commandObjects:TypicalCommand[];
    private token:string;
    private cmdFolder:string;

    constructor(options:{ commandsFolder:string, token:string, prefix:string }) {
        let intents = [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.MESSAGE_CONTENT,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
        ]

        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace('.ts', ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;

        this.bot = new discord.Client({ intents });

        let cmdsCollectd:TypicalCommand[] = [];
        for (let command of this.commands) {
            let cmd = require(`${process.cwd()}/${this.cmdFolder}/${command}.ts`);
            cmdsCollectd.push(new cmd.default());
        }
        this.commandObjects = cmdsCollectd;
    }

    async login(cb:CallableFunction) {
        await this.bot.login(this.token);
        cb();
    }

    start() {
        this.bot.on('messageCreate', async msg => {
            const cmdName = revealNameOfCmd(msg.content, this.prefix);
            if (!cmdName || !this.commands.includes(cmdName)) return;
            let cmd = this.commandObjects.find(c => c.name == cmdName);
            if (!cmd) return;
            cmd.content = msg.content.replace(this.prefix, '').replace(/[ ]+/g, ' ').trim();
            await cmd.execute(msg);
        });
    }
}

export default Bot;