export default FilterList;
declare function FilterList(props: any): JSX.Element;
declare namespace FilterList {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            item: import("prop-types").Requireable<string>;
            items: import("prop-types").Requireable<string>;
        }>>;
        export const filterApi: import("prop-types").Requireable<import("prop-types").InferProps<{}>>;
        export { setValidator as filterState };
        export { string as group };
        export { array as items };
    }
}
import { string } from "prop-types";
import { array } from "prop-types";
