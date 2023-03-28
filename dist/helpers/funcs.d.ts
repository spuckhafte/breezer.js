import { Message } from "discord.js";
export declare function err(desc: string, cmd?: string, warn?: boolean): string;
export declare function buttonSignal(users: string[], msg: Message | undefined, props?: {
    customId?: string;
    max?: number;
    time?: number;
}): import("discord.js").InteractionCollector<import("discord.js").MessageComponentInteraction<import("discord.js").CacheType>> | undefined;
