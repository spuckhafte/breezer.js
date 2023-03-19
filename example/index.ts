import { Bot } from '../index';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot({
    commandsFolder: 'commands',
    token: process.env.TOKEN as string,
    prefix: '!'
});

bot.login(() => console.log('Logged In'))
    .then(() => bot.start());