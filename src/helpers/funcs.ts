import { Message, PermissionResolvable, TextChannel } from "discord.js";

/**Listen to button interactions
 * @param users - array of user-ids who can click on button, empty array => anyone can click
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
                return (users.length == 0 || users.includes(btn.user.id))
                    && msg.id == btn.message.id 
                    && (props?.customId ? props.customId == btn.customId : true);
            },
            max: props?.max,
            time: props?.time
        }
    );
    return collector;
}

/**Check if a user has a specific perm */
export async function userHasPerm(perm:PermissionResolvable, userId:string, msg:Message) {
    const channel = msg.channel as TextChannel;
    const user = await msg.guild?.members.fetch(userId);
    if (!user) return false;
    return channel.permissionsFor(user).has(perm);
}