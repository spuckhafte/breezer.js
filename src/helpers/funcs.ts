import { Message } from "discord.js";

export function err(desc:string, cmd?:string, warn=false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`
}

/**Listen to button interactions
 * @param users - array of user-ids who can click on button
 * @param msg - the msg sent containing the buttons
 * @param props - (?) listen to a specific button of an id only, define the max valid interactions and/or define the time(ms) interval for which the clicks will be valid
 */
export function buttonSignal(
    users:string[], 
    msg:Message|undefined, 
    props?:{ customId?:string, max?:number, time?:number }
) {
    if (!msg) return;
    const collector = msg.channel.createMessageComponentCollector(
        { 
            filter: btn => {
                return users.includes(btn.user.id) 
                    && msg.id == btn.message.id 
                    && (props?.customId ? props.customId == btn.customId : true);
            },
            max: props?.max,
            time: props?.time
        }
    );
    return collector;
}