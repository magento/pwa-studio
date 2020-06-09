export default CategoryContent;
declare function CategoryContent(props: any): JSX.Element;
declare namespace CategoryContent {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            filterContainer: import("prop-types").Requireable<string>;
            gallery: import("prop-types").Requireable<string>;
            headerButtons: import("prop-types").Requireable<string>;
            pagination: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
        export { array as sortProps };
    }
}
import { array } from "prop-types";
