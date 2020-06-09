export default Items;
/**
 * The **Items** component is a container holding all the items
 */
export type Items = any;
export namespace Items {
    /**
     * default props for {@link Items}
     */
    export type defaultProps = any;
}
/**
 * props for {@link Items}
 */
export type props = {
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
     * A callback that fires when the selection state changes
     */
    onSelectionChange: import("prop-types").Requireable<(...args: any[]) => any>;
    /**
     * A render prop for the list item elements. A tagname string, such as `"div"`, is also valid
     */
    renderItem: import("prop-types").Requireable<(...args: any[]) => any> | string;
    /**
     * A string corresponding to a selection model
     */
    selectionModel: any | any;
};
/**
 * The **Items** component is a container holding all the items
 *
 * @typedef Items
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns{React.Element} A React component container for all the items in list.
 */
declare function Items(props: props): any;
declare namespace Items {
    export namespace propTypes {
        export const getItemKey: import("prop-types").Validator<(...args: any[]) => any>;
        export const initialSelection: import("prop-types").Requireable<object>;
        export const items: (props: any, propName: any, componentName: any) => Error;
        export { func as onSelectionChange };
        export const renderItem: import("prop-types").Requireable<string | ((...args: any[]) => any)>;
        export const selectionModel: import("prop-types").Requireable<string>;
    }
    export namespace defaultProps {
        export function getItemKey_1({ id }: {
            id: any;
        }): any;
        export { getItemKey_1 as getItemKey };
        const selectionModel_1: string;
        export { selectionModel_1 as selectionModel };
    }
}
import iterable from "../validators/iterable";
import { func } from "prop-types";
