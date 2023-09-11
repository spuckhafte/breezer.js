var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Intents } from "discord.js";
export function err(desc, cmd, warn = false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`;
}
/**Listen to button interactions
 * @param users - array of user-ids who can click on button, empty array => anyone can click
 * @param msg - the msg sent containing the buttons
 * @param props - (?) listen to a specific button of an id only, define the max valid interactions and/or define the time(ms) interval for which the clicks will be valid
 */
export function buttonSignal(users, msg, props) {
    if (!msg)
        return;
    const collector = msg.channel.createMessageComponentCollector({
        filter: btn => {
            return (users.length == 0 || users.includes(btn.user.id))
                && msg.id == btn.message.id
                && ((props === null || props === void 0 ? void 0 : props.customId) ? props.customId == btn.customId : true);
        },
        max: props === null || props === void 0 ? void 0 : props.max,
        time: props === null || props === void 0 ? void 0 : props.time
    });
    return collector;
}
/**Check if a user has a specific perm */
export function userHasPerm(perm, userId, msg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const channel = msg.channel;
        const user = yield ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(userId));
        if (!user)
            return false;
        return channel.permissionsFor(user).has(perm);
    });
}
export function getIntents() {
    return [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ];
}
