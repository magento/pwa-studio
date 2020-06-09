export default PaymentsFormItems;
/**
 * This component is meant to be nested within an `informed` form. It utilizes
 * form state to do conditional rendering and submission.
 */
declare function PaymentsFormItems(props: any): JSX.Element;
declare namespace PaymentsFormItems {
    export namespace propTypes {
        export const onCancel: import("prop-types").Validator<(...args: any[]) => any>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            address_check: import("prop-types").Requireable<string>;
            body: import("prop-types").Requireable<string>;
            button: import("prop-types").Requireable<string>;
            braintree: import("prop-types").Requireable<string>;
            firstname: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
            telephone: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            region_code: import("prop-types").Requireable<string>;
            street0: import("prop-types").Requireable<string>;
        }>>;
        export { array as countries };
        export { bool as isSubmitting };
        export const setIsSubmitting: import("prop-types").Validator<(...args: any[]) => any>;
        export const onSubmit: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { array } from "prop-types";
import { bool } from "prop-types";
