import { Message } from "discord.js";
export declare function err(desc: string, cmd?: string, warn?: boolean): string;
/**Listen to button interactions
 * @param users - array of user-ids who can click on button
 * @param msg - the msg sent containing the buttons
 * @param props - (?) listen to a specific button of an id only, define the max valid interactions and/or define the time(ms) interval for which the clicks will be valid
 */
export declare function buttonSignal(users: string[], msg: Message | undefined, props?: {
    customId?: string;
    max?: number;
    time?: number;
}): import("discord.js").InteractionCollector<import("discord.js").MessageComponentInteraction<import("discord.js").CacheType>> | undefined;
