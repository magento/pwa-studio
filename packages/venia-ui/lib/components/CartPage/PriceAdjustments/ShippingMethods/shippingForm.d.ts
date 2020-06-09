export default ShippingForm;
export const SET_SHIPPING_ADDRESS_MUTATION: any;
declare function ShippingForm(props: any): JSX.Element;
declare namespace ShippingForm {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            zip: import("prop-types").Requireable<string>;
        }>>;
        export const selectedShippingFields: import("prop-types").Requireable<import("prop-types").InferProps<{
            country: import("prop-types").Validator<string>;
            region: import("prop-types").Validator<string>;
            zip: import("prop-types").Validator<string>;
        }>>;
        export { func as setIsFetchingMethods };
    }
}
import { func } from "prop-types";
