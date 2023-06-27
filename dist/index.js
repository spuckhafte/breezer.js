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
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';
import { buttonSignal } from './helpers/funcs.js';
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
        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace(options.lang, ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;
        this.lang = options.lang;
        this.bot = new discord.Client({ intents });
        let cmdsCollectd = {};
        for (let command of this.commands) {
            import(`file://${process.cwd()}/${this.cmdFolder}/${command}${this.lang}`).then(cmd => {
                if (cmd.default)
                    cmdsCollectd[command] = cmd.default;
            }).catch(e => console.log(e));
        }
        this.commandObjects = cmdsCollectd;
    }
    go(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.login(this.token);
            this.bot.on('messageCreate', (msg) => __awaiter(this, void 0, void 0, function* () {
                const cmdName = revealNameOfCmd(msg.content, this.prefix);
                if (!cmdName || !this.commands.includes(cmdName))
                    return;
                let cmdClass = this.commandObjects[cmdName];
                const cmd = new cmdClass();
                cmd.content = msg.content.replace(this.prefix, '').replace(/[ ]+/g, ' ').trim();
                cmd.msg = msg;
                cmd.execute();
            }));
            if (cb)
                cb();
        });
    }
}
/**Check if the bot has a specific perm */
function hasPermInGuild(perm, msg) {
    var _a;
    const channel = msg.channel;
    return (_a = channel.guild.members.me) === null || _a === void 0 ? void 0 : _a.permissionsIn(channel).has(perm);
}
function hasPermInChannel(perm, msg, userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const channel = msg.channel;
        const user = yield ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(userId !== null && userId !== void 0 ? userId : msg.author.id));
        if (!user)
            return false;
        return channel.permissionsFor(user).has(perm);
    });
}
export { Bot, Command, StateManager, buttonSignal, hasPermInChannel, hasPermInGuild };
