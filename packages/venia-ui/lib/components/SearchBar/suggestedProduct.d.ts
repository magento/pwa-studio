export default SuggestedProduct;
declare function SuggestedProduct(props: any): JSX.Element;
declare namespace SuggestedProduct {
    export namespace propTypes {
        export const url_key: import("prop-types").Validator<string>;
        export const small_image: import("prop-types").Validator<string>;
        export const name: import("prop-types").Validator<string>;
        export { func as onNavigate };
        export const price: import("prop-types").Validator<import("prop-types").InferProps<{
            regularPrice: import("prop-types").Requireable<import("prop-types").InferProps<{
                amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                    currency: import("prop-types").Requireable<string>;
                    value: import("prop-types").Requireable<number>;
                }>>;
            }>>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            image: import("prop-types").Requireable<string>;
            name: import("prop-types").Requireable<string>;
            price: import("prop-types").Requireable<string>;
            thumbnail: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { func } from "prop-types";
