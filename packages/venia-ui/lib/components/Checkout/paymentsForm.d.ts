export default PaymentsForm;
/**
 * A wrapper around the payment form. This component's purpose is to maintain
 * the submission state as well as prepare/set initial values.
 */
declare function PaymentsForm(props: any): JSX.Element;
declare namespace PaymentsForm {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const initialValues: import("prop-types").Requireable<import("prop-types").InferProps<{
            firstname: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
            telephone: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            region_code: import("prop-types").Requireable<string>;
            sameAsShippingAddress: import("prop-types").Requireable<boolean>;
            street0: import("prop-types").Requireable<any[]>;
        }>>;
    }
    export namespace defaultProps {
        const initialValues_1: {};
        export { initialValues_1 as initialValues };
    }
}
