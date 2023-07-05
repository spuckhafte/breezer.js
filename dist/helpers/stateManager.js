import Events from 'events';
export class StateManager {
    /**Manage states, globally or for specific commands
     *
     * `{ stateName: stateValue (type: any) }`
     */
    constructor(states) {
        this.states = states;
        const event = new Events();
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
function _structuredClone(value) {
    // @ts-ignore
    if (global.structuredClone) {
        return structuredClone(value);
    }
    else
        return JSON.parse(JSON.stringify(value));
}
