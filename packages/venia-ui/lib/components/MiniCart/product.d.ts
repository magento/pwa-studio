export default Product;
declare function Product(props: any): JSX.Element;
declare namespace Product {
    export namespace propTypes {
        export const beginEditItem: import("prop-types").Validator<(...args: any[]) => any>;
        export { string as currencyCode };
        export const item: import("prop-types").Validator<import("prop-types").InferProps<{
            image: import("prop-types").Requireable<import("prop-types").InferProps<{
                file: import("prop-types").Requireable<string>;
            }>>;
            name: import("prop-types").Requireable<string>;
            options: import("prop-types").Requireable<any[]>;
            price: import("prop-types").Requireable<number>;
            qty: import("prop-types").Requireable<number>;
        }>>;
    }
}
import { string } from "prop-types";
