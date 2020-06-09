export default Overview;
/**
 * The Overview component renders summaries for each section of the editable
 * form.
 */
declare function Overview(props: any): JSX.Element;
declare namespace Overview {
    export namespace propTypes {
        export const cancelCheckout: import("prop-types").Validator<(...args: any[]) => any>;
        export const cart: import("prop-types").Validator<import("prop-types").InferProps<{
            details: import("prop-types").Validator<import("prop-types").InferProps<{
                items: import("prop-types").Requireable<any[]>;
                prices: import("prop-types").Requireable<import("prop-types").InferProps<{
                    grand_total: import("prop-types").Requireable<import("prop-types").InferProps<{
                        currency: import("prop-types").Validator<string>;
                        value: import("prop-types").Validator<number>;
                    }>>;
                }>>;
            }>>;
        }>>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
        }>>;
        export { bool as hasPaymentMethod };
        export { bool as hasShippingAddress };
        export { bool as hasShippingMethod };
        export { bool as isSubmitting };
        export { object as paymentData };
        export { bool as ready };
        export { func as setEditing };
        export { func as submitOrder };
        export { bool as submitting };
    }
}
import { bool } from "prop-types";
import { object } from "prop-types";
import { func } from "prop-types";
