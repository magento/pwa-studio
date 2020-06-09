export default PaymentMethodSummary;
declare function PaymentMethodSummary(props: any): JSX.Element;
declare namespace PaymentMethodSummary {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            informationPrompt: import("prop-types").Requireable<string>;
            paymentDisplayPrimary: import("prop-types").Requireable<string>;
            paymentDisplaySecondary: import("prop-types").Requireable<string>;
        }>>;
        export { bool as hasPaymentMethod };
        export const paymentData: import("prop-types").Requireable<import("prop-types").InferProps<{
            description: import("prop-types").Requireable<string>;
            details: import("prop-types").Requireable<import("prop-types").InferProps<{
                cardType: import("prop-types").Requireable<string>;
            }>>;
        }>>;
    }
}
import { bool } from "prop-types";
