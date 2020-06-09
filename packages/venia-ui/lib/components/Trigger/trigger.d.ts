export default Trigger;
/**
 * A component that will trigger a given action.
 */
export type Trigger = any;
/**
 * Props for {@link Trigger}
 */
export type props = {
    /**
     * the handler for on the `onClick` event
     * handler.
     */
    action: Function;
    /**
     * any elements that will be child
     * elements inside the root container.
     */
    children: any;
    /**
     * An object containing the class names for the
     * Trigger component.
     */
    classes: {
        root: string;
    };
};
/**
 * A component that will trigger a given action.
 *
 * @typedef Trigger
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that when triggered invokes the action.
 */
declare function Trigger(props: props): any;
declare namespace Trigger {
    export namespace propTypes {
        export const action: import("prop-types").Validator<(...args: any[]) => any>;
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { node } from "prop-types";
