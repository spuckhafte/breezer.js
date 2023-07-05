import Events from 'events';
import { States } from '../../types';

export class StateManager {
    states:States;
    event:Events;
    
    /**Manage states, globally or for specific commands
     * 
     * `{ stateName: stateValue (type: any) }`
     */
    constructor(states:States) {
        this.states = states;
        const event = new Events();
        this.event = event;
    }

    get(stateName:string) {
        return this.states[stateName];
    }

    set<T>(stateName:string, stateValue:((prevVal:T) => T)) {
        const val = stateValue(this.get(stateName));
        this.states[stateName] = val;
        this.event.emit("stateChange");
    }

    clone() {
        return new StateManager(_structuredClone(this.states));
    }
}

function _structuredClone<T>(value: T): T {
    // @ts-ignore
    if (global.structuredClone) {
        return global.structuredClone(value)
    } else return JSON.parse(JSON.stringify(value)) as T;
}
