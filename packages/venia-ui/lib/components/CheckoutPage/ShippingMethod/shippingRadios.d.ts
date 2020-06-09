export default ShippingRadios;
declare function ShippingRadios(props: any): JSX.Element;
declare namespace ShippingRadios {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            error: import("prop-types").Requireable<string>;
            radioMessage: import("prop-types").Requireable<string>;
            radioLabel: import("prop-types").Requireable<string>;
            radioRoot: import("prop-types").Requireable<string>;
        }>>;
        export { bool as disabled };
        export const shippingMethods: import("prop-types").Validator<import("prop-types").InferProps<{
            amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                currency: import("prop-types").Requireable<string>;
                value: import("prop-types").Requireable<number>;
            }>>;
            available: import("prop-types").Requireable<boolean>;
            carrier_code: import("prop-types").Requireable<string>;
            carrier_title: import("prop-types").Requireable<string>;
            method_code: import("prop-types").Requireable<string>;
            method_title: import("prop-types").Requireable<string>;
            serializedValue: import("prop-types").Validator<string>;
        }>[]>;
    }
}
import { bool } from "prop-types";
