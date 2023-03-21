import { Bot } from '../dist'
import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot({
    token: "ff",
    prefix: "!",
    commandsFolder: "!"
})
bot.login(() => console.log('Logged In'))
    .then(() => bot.start());