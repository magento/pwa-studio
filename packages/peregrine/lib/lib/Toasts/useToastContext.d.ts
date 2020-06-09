/**
 * A [context]{@link https://reactjs.org/docs/context.html} provider that
 * provides the toast state object and a dispatch function to toast
 * functionality consumers.
 */
export type ToastContextProvider = any;
export function ToastContextProvider({ children }: {
    children: any;
}): JSX.Element;
/**
 * A hook that provides access to the toast state and dispatch.
 * Any component using this hook _must_ be a child of a {@link ToastContextProvider}.
 */
export type useToastContext = any;
export function useToastContext(): any[];
/**
 * The current state of the toast store.
 */
export type ToastState = {
    /**
     * Map object associating an id to toast data
     */
    toasts: Map<any, any>;
};
