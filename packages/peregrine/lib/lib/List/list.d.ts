export default List;
/**
 * The **List** component maps a collection of data objects into an array of elements.
 * It also manages the selection and focus of those elements.
 */
export type List = any;
/**
 * props for {@link List}
 */
export type props = {
    /**
     * css classes prop for List
     */
    classes: {
        root: string;
    };
    /**
     * item key value getter
     */
    getItemKey: import("prop-types").Requireable<(...args: any[]) => any>;
    /**
     * A single or list of objects that should start off selected
     */
    initialSelection: any[] | object;
    /**
     * An iterable that yields `[key, item]` pairs such as an ES2015 Map
     */
    items: typeof iterable;
    /**
     * A render prop for the list element. A tagname string, such as `"div"`, is also valid.
     */
    render: import("prop-types").Requireable<(...args: any[]) => any> | string;
    /**
     * A render prop for the list item elements. A tagname string, such as `"div"`, is also valid
     */
    renderItem: import("prop-types").Requireable<(...args: any[]) => any> | string;
    /**
     * A callback that fires when the selection state changes
     */
    onSelectionChange: import("prop-types").Requireable<(...args: any[]) => any>;
    /**
     * A string corresponding to a selection model
     */
    selectionModel: any | any;
};
/**
 * default props for {@link List}
 */
export type defaultProps = any;
/**
 * The **List** component maps a collection of data objects into an array of elements.
 * It also manages the selection and focus of those elements.
 *
 * @typedef List
 * @kind functional component
 *
 * @param {props} props React Component props
 *
 * @returns{React.Element} A React component that displays list data.
 */
declare function List(props: props): any;
declare namespace List {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const getItemKey: import("prop-types").Validator<(...args: any[]) => any>;
        export const initialSelection: import("prop-types").Requireable<object>;
        export const items: (props: any, propName: any, componentName: any) => Error;
        export const render: import("prop-types").Validator<string | ((...args: any[]) => any)>;
        export const renderItem: import("prop-types").Requireable<string | ((...args: any[]) => any)>;
        export { func as onSelectionChange };
        export const selectionModel: import("prop-types").Requireable<string>;
    }
    export namespace defaultProps {
        const classes_1: {};
        export { classes_1 as classes };
        export function getItemKey_1({ id }: {
            id: any;
        }): any;
        export { getItemKey_1 as getItemKey };
        const items_1: any[];
        export { items_1 as items };
        const render_1: string;
        export { render_1 as render };
        const renderItem_1: string;
        export { renderItem_1 as renderItem };
        const selectionModel_1: string;
        export { selectionModel_1 as selectionModel };
    }
}
import iterable from "../validators/iterable";
import { func } from "prop-types";
