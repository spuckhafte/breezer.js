var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import discord, { Intents } from 'discord.js';
import fs from 'fs';
import { revealNameOfCmd } from './helpers/handlers.js';
class Bot {
    constructor(options) {
        let intents = [
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.MESSAGE_CONTENT,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
        ];
        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace(this.lang, ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;
        this.lang = options.lang;
        this.bot = new discord.Client({ intents });
        let cmdsCollectd = {};
        for (let command of this.commands) {
            let cmd = require(`${process.cwd()}/${this.cmdFolder}/${command}${this.lang}`);
            if (cmd.default)
                cmdsCollectd[command] = cmd.default;
        }
        this.commandObjects = cmdsCollectd;
    }
    login(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.login(this.token);
            if (cb)
                cb();
        });
    }
    start() {
        this.bot.on('messageCreate', (msg) => __awaiter(this, void 0, void 0, function* () {
            const cmdName = revealNameOfCmd(msg.content, this.prefix);
            if (!cmdName || !this.commands.includes(cmdName))
                return;
            let cmdClass = this.commandObjects[cmdName];
            const cmd = new cmdClass();
            cmd.content = msg.content.replace(this.prefix, '').replace(/[ ]+/g, ' ').trim();
            cmd.execute(msg);
        }));
    }
}
export default Bot;
