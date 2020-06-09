export default CreditCard;
declare function CreditCard(props: any): JSX.Element;
declare namespace CreditCard {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            dropin_root: import("prop-types").Requireable<string>;
            billing_address_fields_root: import("prop-types").Requireable<string>;
            first_name: import("prop-types").Requireable<string>;
            last_name: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            state: import("prop-types").Requireable<string>;
            postal_code: import("prop-types").Requireable<string>;
            phone_number: import("prop-types").Requireable<string>;
            country: import("prop-types").Requireable<string>;
            street1: import("prop-types").Requireable<string>;
            street2: import("prop-types").Requireable<string>;
            address_check: import("prop-types").Requireable<string>;
            credit_card_root: import("prop-types").Requireable<string>;
            credit_card_root_hidden: import("prop-types").Requireable<string>;
        }>>;
        export const shouldSubmit: import("prop-types").Validator<boolean>;
        export { func as onPaymentSuccess };
        export { func as onDropinReady };
        export { func as onPaymentError };
        export const resetShouldSubmit: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { func } from "prop-types";
