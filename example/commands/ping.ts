import { Message } from "discord.js";
import { Command } from '../../dist/helpers/command';

export default class extends Command {
    constructor() {
        super({
            structure: [],
            name: 'ping'
        });
    }

    async execute(msg: Message<boolean>) {
        msg.reply({
            content: 'Pong!',
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}