"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const events_1 = __importDefault(require("events"));
class StateManager {
    /**Manage states, globally or for specific commands
     *
     * `{ stateName: stateValue (type: any) }`
     */
    constructor(states) {
        this.states = states;
        const event = new events_1.default();
        this.event = event;
    }
    get(stateName) {
        return this.states[stateName];
    }
    set(stateName, stateValue) {
        const val = stateValue(this.get(stateName));
        this.states[stateName] = val;
        this.event.emit("stateChange");
    }
    clone() {
        return new StateManager(structuredClone(this.states));
    }
}
exports.StateManager = StateManager;
