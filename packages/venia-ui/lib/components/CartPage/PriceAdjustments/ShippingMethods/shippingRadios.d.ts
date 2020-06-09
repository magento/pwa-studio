export default ShippingRadios;
export const SET_SHIPPING_METHOD_MUTATION: any;
declare function ShippingRadios(props: any): JSX.Element;
declare namespace ShippingRadios {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            radioContents: import("prop-types").Requireable<string>;
            radioRoot: import("prop-types").Requireable<string>;
        }>>;
        export { string as selectedShippingMethod };
        export const shippingMethods: import("prop-types").Requireable<import("prop-types").InferProps<{
            amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                currency: import("prop-types").Validator<string>;
                value: import("prop-types").Validator<number>;
            }>>;
            carrier_code: import("prop-types").Validator<string>;
            method_code: import("prop-types").Validator<string>;
            method_title: import("prop-types").Validator<string>;
        }>[]>;
    }
}
import { string } from "prop-types";
