export default FilterFooter;
declare function FilterFooter(props: any): JSX.Element;
declare namespace FilterFooter {
    export namespace propTypes {
        export const applyFilters: import("prop-types").Validator<(...args: any[]) => any>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { bool as hasFilters };
        export { bool as isOpen };
        export const resetFilters: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { bool } from "prop-types";
