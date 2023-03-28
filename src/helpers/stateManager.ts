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
        return new StateManager(structuredClone(this.states));
    }
}
