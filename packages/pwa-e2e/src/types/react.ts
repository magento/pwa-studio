import { Dictionary } from './common';

export type Props = Dictionary;
export type State = object | Dictionary;
export type Key = string;

export type ReactComponent<
    P extends Props,
    S extends State = {},
    K extends Key = Key
    > = {
        props: P;
        state?: S,
        key?: K;
    };

export type DefaultReactComponent = ReactComponent<Props>;

/** classes types helper */
type Classes<T> = Pick<T, keyof T>;
type ClassesWithRoot<T> = Classes<T & { root: string }>;

export type PropsWithClasses<P extends Props, C = {} | Dictionary> = { classes: Classes<C> } & P;
export type PropsWithRootClasses<P extends Props, C = {} | Dictionary> = { classes: ClassesWithRoot<C> } & P;
