"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = void 0;
function err(desc, cmd, warn = false) {
    return `[${warn ? 'warn' : 'err'}][cmd: ${cmd}] ${desc}`;
}
exports.err = err;
