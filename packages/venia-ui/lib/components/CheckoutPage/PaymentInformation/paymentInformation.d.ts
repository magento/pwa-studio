export default PaymentInformation;
declare function PaymentInformation(props: any): JSX.Element;
declare namespace PaymentInformation {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            container: import("prop-types").Requireable<string>;
            payment_info_container: import("prop-types").Requireable<string>;
            review_order_button: import("prop-types").Requireable<string>;
        }>>;
        export const onSave: import("prop-types").Validator<(...args: any[]) => any>;
        export const checkoutError: import("prop-types").Requireable<any>;
        export const resetShouldSubmit: import("prop-types").Validator<(...args: any[]) => any>;
        export { bool as shouldSubmit };
    }
}
import { bool } from "prop-types";
