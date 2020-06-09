export default Category;
declare function Category(props: any): JSX.Element;
declare namespace Category {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            gallery: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
        }>>;
        export { number as id };
        export { number as pageSize };
    }
    export namespace defaultProps {
        export const id: number;
        export const pageSize: number;
    }
}
import { number } from "prop-types";
