export interface Dictionary {
    // tslint:disable-next-line:no-any
    [name: string]: any;
}

// tslint:disable-next-line:no-any
export type Constructorable<T> = new (...args: any[]) => T;

export type GraphQL<T> = Pick<T, keyof T> & { __typename: string; };
