export default PaymentMethods;
declare function PaymentMethods(props: any): JSX.Element;
declare namespace PaymentMethods {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            payment_method: import("prop-types").Requireable<string>;
            radio_label: import("prop-types").Requireable<string>;
        }>>;
        export { func as onPaymentSuccess };
        export { func as onPaymentError };
        export { func as resetShouldSubmit };
        export { string as selectedPaymentMethod };
        export { bool as shouldSubmit };
    }
}
import { func } from "prop-types";
import { string } from "prop-types";
import { bool } from "prop-types";
