import Bot from '../dist'
import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot({
    token: "MTA2NTA5MTQ2NjU1MDA1MDg3Nw.Goa6Pp.FwfqDSI0YwXEi1oc-36bxLBk_etaPvmtf9Mk7k",
    prefix: "!",
    commandsFolder: "./example/commands"
})
bot.login(() => console.log('Logged In'))
    .then(() => bot.start());