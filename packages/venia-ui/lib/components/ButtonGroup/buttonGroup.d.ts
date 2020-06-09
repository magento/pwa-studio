export default ButtonGroup;
/**
 * A component that creates a group of buttons.
 */
export type ButtonGroup = any;
/**
 * Props for {@link ButtonGroup}
 */
export type props = {
    /**
     * An object containing the class names for the
     * ButtonGroup component.
     */
    classes: {
        root: string;
    };
    /**
     * the items to evaluate
     * memoization recomputation.
     */
    items: {
        /**
         * component to render for the
         * ButtonGroups's button component
         */
        children: any;
        /**
         * the unique id for a button element
         */
        key: string;
    }[];
};
/**
 * A component that creates a group of buttons.
 *
 * @typedef ButtonGroup
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays multiple buttons.
 */
declare function ButtonGroup(props: props): any;
declare namespace ButtonGroup {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const items: import("prop-types").Validator<import("prop-types").InferProps<{
            children: import("prop-types").Validator<import("prop-types").ReactNodeLike>;
            key: import("prop-types").Validator<string>;
        }>[]>;
    }
    export namespace defaultProps {
        const items_1: any[];
        export { items_1 as items };
    }
}
