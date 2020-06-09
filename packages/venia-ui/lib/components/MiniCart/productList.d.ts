export default ProductList;
declare function ProductList(props: any): JSX.Element;
declare namespace ProductList {
    export namespace propTypes {
        export { func as beginEditItem };
        export { array as cartItems };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as currencyCode };
    }
}
import { func } from "prop-types";
import { array } from "prop-types";
import { string } from "prop-types";
