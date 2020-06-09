export default Button;
/**
 * A component for buttons.
 */
export type Button = any;
/**
 * Props for {@link Button}
 */
export type props = {
    /**
     * An object containing the class names for the
     * Button component.
     */
    classes: {
        content: string;
        root: string;
        root_highPriority: string;
        root_lowPriority: string;
        root_normalPriority: string;
    };
    /**
     * the priority/importance of the Button
     */
    priority: string;
    /**
     * the type of the Button
     */
    type: string;
};
/**
 * A component for buttons.
 *
 * @typedef Button
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single button.
 */
declare function Button(props: props): any;
declare namespace Button {
    export const propTypes: {
        classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            content: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            root_highPriority: import("prop-types").Requireable<string>;
            root_lowPriority: import("prop-types").Requireable<string>;
            root_normalPriority: import("prop-types").Requireable<string>;
        }>>;
        priority: import("prop-types").Validator<string>;
        type: import("prop-types").Validator<string>;
    };
    export const defaultProps: {
        priority: string;
        type: string;
    };
}
