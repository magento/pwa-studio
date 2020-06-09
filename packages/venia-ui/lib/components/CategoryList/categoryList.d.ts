export default CategoryList;
declare function CategoryList(props: any): JSX.Element;
declare namespace CategoryList {
    export namespace propTypes {
        export { number as id };
        export { string as title };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            content: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { number } from "prop-types";
import { string } from "prop-types";
