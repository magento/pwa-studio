export default Item;
/**
 * The **Item** Component is reponsible for rendering each item in list
 */
export type Item = any;
export namespace Item {
    /**
     * default props for {@link Item}
     */
    export type defaultProps = any;
}
/**
 * props for {@link Item}
 */
export type props = {
    /**
     * css classes prop for Item
     */
    classes: {
        root: string;
    };
    /**
     * Does the item have focus
     */
    hasFocus: import("prop-types").Requireable<boolean>;
    /**
     * Is the item currently selected
     */
    isSelected: import("prop-types").Requireable<boolean>;
    /**
     * item data
     */
    item: any;
    /**
     * index of item
     */
    itemIndex: number;
    /**
     * A render prop for the list item. A tagname string, such as `"div"`, is also valid
     */
    render: import("prop-types").Requireable<(...args: any[]) => any> | string;
    /**
     * A callback for setting focus
     */
    setFocus: import("prop-types").Requireable<(...args: any[]) => any>;
    /**
     * unique Id given for the item
     */
    uniqueId: number | string;
    /**
     * A callback for updating selected items
     */
    updateSelectedKeys: import("prop-types").Requireable<(...args: any[]) => any>;
};
/**
 * The **Item** Component is reponsible for rendering each item in list
 *
 * @typedef Item
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns{React.Element} A React component for rendering each item in list.
 */
declare function Item(props: props): any;
declare namespace Item {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { bool as hasFocus };
        export { bool as isSelected };
        export const item: import("prop-types").Validator<any>;
        export const itemIndex: import("prop-types").Validator<number>;
        export const render: import("prop-types").Validator<string | ((...args: any[]) => any)>;
        export { func as setFocus };
        export const uniqueId: import("prop-types").Validator<string | number>;
        export const updateSelectedKeys: import("prop-types").Validator<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        const classes_1: {};
        export { classes_1 as classes };
        export const hasFocus: boolean;
        export const isSelected: boolean;
        const render_1: string;
        export { render_1 as render };
    }
}
import { bool } from "prop-types";
import { func } from "prop-types";
