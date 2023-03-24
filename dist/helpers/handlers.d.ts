export declare const extractFieldValuesHandler: {
    string: (data: string, strict: boolean, name: string | undefined) => string;
    number: (data: string, strict: boolean, name: string | undefined) => string | number;
};
export declare function revealNameOfCmd(content: string, prefix: string): string | false;
