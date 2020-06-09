export default SortItem;
declare function SortItem(props: any): JSX.Element;
declare namespace SortItem {
    export namespace propTypes {
        export { bool as active };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            content: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            text: import("prop-types").Requireable<string>;
        }>>;
        export { func as onClick };
    }
}
import { bool } from "prop-types";
import { func } from "prop-types";
