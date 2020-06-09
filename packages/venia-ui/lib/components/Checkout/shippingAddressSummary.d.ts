export default ShippingAddressSummary;
declare function ShippingAddressSummary(props: any): JSX.Element;
declare namespace ShippingAddressSummary {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            informationPrompt: import("prop-types").Requireable<string>;
        }>>;
        export { bool as hasShippingAddress };
        export const shippingAddress: import("prop-types").Requireable<import("prop-types").InferProps<{
            firstName: import("prop-types").Requireable<string>;
            lastName: import("prop-types").Requireable<string>;
            street: import("prop-types").Requireable<any[]>;
        }>>;
    }
}
import { bool } from "prop-types";
