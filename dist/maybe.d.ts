export declare class Maybe {
    $value: any;
    get isNothing(): boolean;
    get isJust(): boolean;
    constructor(x: any);
    static of(x: any): Maybe;
    map(fn: any): Maybe;
    chain(fn: any): any;
    join(): any;
}
export declare const maybe: (x: any) => Maybe;
