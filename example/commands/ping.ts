import { Message } from "discord.js";
import { Command } from "../../index";

export default class extends Command {
    constructor() {
        super({
            structure: [],
            strict: true,
            name: 'ping'
        });
    }

    async execute(msg: Message<boolean>) {
        msg.reply({
            content: 'Pong!',
            allowedMentions: {
                repliedUser: false
            }
        })
    }
}