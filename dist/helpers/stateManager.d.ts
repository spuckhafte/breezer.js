/// <reference types="node" />
import Events from 'events';
import { States } from '../../types';
export declare class StateManager {
    states: States;
    event: Events;
    /**Manage states, globally or for specific commands
     *
     * `{ stateName: stateValue (type: any) }`
     */
    constructor(states: States);
    get(stateName: string): any;
    set<T>(stateName: string, stateValue: ((prevVal: T) => T)): void;
    clone(): StateManager;
}
