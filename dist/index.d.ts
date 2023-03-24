import discord from 'discord.js';
declare class Bot {
    commands: string[];
    bot: discord.Client;
    prefix: string;
    private commandObjects;
    private token;
    private cmdFolder;
    constructor(options: {
        commandsFolder: string;
        token: string;
        prefix: string;
    });
    login(cb: CallableFunction): Promise<void>;
    start(): void;
}
export default Bot;
