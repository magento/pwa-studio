export default NoProductsFound;
declare function NoProductsFound(props: any): JSX.Element;
declare namespace NoProductsFound {
    export namespace propTypes {
        export { number as categoryId };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
            list: import("prop-types").Requireable<string>;
            categories: import("prop-types").Requireable<string>;
            listItem: import("prop-types").Requireable<string>;
            image: import("prop-types").Requireable<string>;
            imageContainer: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { number } from "prop-types";
