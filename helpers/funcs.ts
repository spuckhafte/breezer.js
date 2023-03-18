export function err(desc:string, cmd?:string, warn=false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`
}