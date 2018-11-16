export interface Dictionary {
    [name: string]: any;
}

export type Constructorable<T> = new (...args: any[]) => T;

export type GraphQL<T> = Pick<T, keyof T> & { __typename: string; };
