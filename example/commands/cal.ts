import { Message, TextChannel } from "discord.js";
import { Command } from "../../index";

export default class extends Command {
    constructor() {
        super({
            structure: ['string', 'number', 'number'],
            strict: true,
            name: 'cal'
        });
    }

    async execute(msg: Message<boolean>): Promise<void> {
        const [type, num1, num2] = this.extract();
        const channel = (msg.channel as TextChannel);

        if (type == 'add') {
            channel.send(`${num1} + ${num2} = ${+num1 + +num2}`);
        } else if (type == 'sub') {
            channel.send(`${num1} - ${num2} = ${+num1 - +num2}`);
        } else if (type == 'pro') {
            channel.send(`${num1} x ${num2} = ${+num1 * +num2}`);
        } else if (type == 'div') {
            channel.send(`${num1} / ${num2} = ${+num1 / +num2}`);
        } else {
            channel.send("Invalid operation");
        }
    }
}