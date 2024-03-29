var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import discord from 'discord.js';
import fs from 'fs';
import { revealNameOfCmd } from './helpers/handlers.js';
import { Command } from './helpers/command.js';
import { StateManager } from './helpers/stateManager.js';
import { buttonSignal, userHasPerm } from './helpers/funcs.js';
import { getIntents } from './helpers/handlers.js';
class Bot {
    constructor(options) {
        var _a;
        this.commands = fs.readdirSync(options.commandsFolder).map(i => i.replace(options.lang, ''));
        this.token = options.token;
        this.cmdFolder = options.commandsFolder;
        this.prefix = options.prefix;
        this.lang = options.lang;
        this.bot = new discord.Client({ intents: (_a = this.intents) !== null && _a !== void 0 ? _a : getIntents() });
        let cmdsCollectd = {};
        for (let command of this.commands) {
            const cmdPath = `file://${process.cwd()}/${this.cmdFolder}/${command}${this.lang}`;
            import(cmdPath).then(cmd => {
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
                msg.content = msg.content.toLowerCase();
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
export { Bot, Command, StateManager, buttonSignal, userHasPerm };
