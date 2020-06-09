export default ToastContainer;
/**
 * A container for toast notifications.
 *
 * This component must be a child, nested or otherwise, of a
 * ToastContextProvider component.
 */
export type ToastContainer = any;
/**
 * Props for {@link ToastContainer}
 */
export type props = {
    /**
     * An object containing the class names for the
     * ToastContainer and its Toast components
     */
    classes: {
        root: string;
    };
};
/**
 * A container for toast notifications.
 *
 * This component must be a child, nested or otherwise, of a
 * ToastContextProvider component.
 *
 * @typedef ToastContainer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays toast notification data.
 */
declare function ToastContainer(props: props): any;
declare namespace ToastContainer {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
    }
}
