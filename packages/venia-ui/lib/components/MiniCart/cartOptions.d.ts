export default CartOptions;
declare function CartOptions(props: any): JSX.Element;
declare namespace CartOptions {
    export namespace propTypes {
        export const cartItem: import("prop-types").Requireable<import("prop-types").InferProps<{
            id: import("prop-types").Validator<string>;
            product: import("prop-types").Requireable<import("prop-types").InferProps<{
                name: import("prop-types").Validator<string>;
                price: import("prop-types").Requireable<import("prop-types").InferProps<{
                    regularPrice: import("prop-types").Requireable<import("prop-types").InferProps<{
                        amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                            value: import("prop-types").Validator<number>;
                        }>>;
                    }>>;
                }>>;
            }>>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            focusItem: import("prop-types").Requireable<string>;
            price: import("prop-types").Requireable<string>;
            form: import("prop-types").Requireable<string>;
            quantity: import("prop-types").Requireable<string>;
            quantityTitle: import("prop-types").Requireable<string>;
            save: import("prop-types").Requireable<string>;
            options: import("prop-types").Requireable<string>;
        }>>;
        export const configItem: import("prop-types").Validator<import("prop-types").InferProps<{
            __typename: import("prop-types").Requireable<string>;
            configurable_options: import("prop-types").Requireable<any[]>;
        }>>;
        export { string as currencyCode };
        export const endEditItem: import("prop-types").Validator<(...args: any[]) => any>;
        export { bool as isUpdatingItem };
    }
}
import { string } from "prop-types";
import { bool } from "prop-types";
