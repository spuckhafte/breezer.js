import { StateManager } from './stateManager.js';
export declare const extractFieldValuesHandler: {
    string: (data: string, strict: boolean, name: string | undefined) => string;
    number: (data: string, strict: boolean, name: string | undefined) => string | number;
};
export declare function revealNameOfCmd(content: string, prefix: string): string | false;
export declare function formatString(text: string, states: StateManager): string;
export declare function stateExtracter(text: string, states: StateManager): string;
export declare function checkForOperation(text: string): boolean;
export declare function getIntents(): number[];
export declare function err(desc: string, cmd?: string, warn?: boolean): string;
