export function err(desc, cmd, warn = false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`;
}
/**Listen to button interactions
 * @param users - array of user-ids who can click on button
 * @param msg - the msg sent containing the buttons
 * @param props - (?) listen to a specific button of an id only, define the max valid interactions and/or define the time(ms) interval for which the clicks will be valid
 */
export function buttonSignal(users, msg, props) {
    if (!msg)
        return;
    const collector = msg.channel.createMessageComponentCollector({
        filter: btn => {
            return users.includes(btn.user.id)
                && msg.id == btn.message.id
                && ((props === null || props === void 0 ? void 0 : props.customId) ? props.customId == btn.customId : true);
        },
        max: props === null || props === void 0 ? void 0 : props.max,
        time: props === null || props === void 0 ? void 0 : props.time
    });
    return collector;
}
