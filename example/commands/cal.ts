import { Message, TextChannel } from "discord.js";
import { Command } from '../../dist/helpers/command';

export default class extends Command {
    constructor() {
        super({
            structure: ['string'],
            name: 'cal'
        });
    }

    async execute(msg: Message<boolean>): Promise<void> {
        const [operation] = this.extract();
        const channel = (msg.channel as TextChannel);

        let value:string;
        try {
            value = eval(operation as string);
        } catch (_) {
            value = 'Invalid Operation'
        }

        channel.send(value.toString());
    }
}