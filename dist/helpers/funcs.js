export function err(desc, cmd, warn = false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`;
}
