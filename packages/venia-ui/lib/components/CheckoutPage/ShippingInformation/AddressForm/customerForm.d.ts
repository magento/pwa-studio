export default CustomerForm;
declare function CustomerForm(props: any): JSX.Element;
declare namespace CustomerForm {
    export namespace defaultProps {
        export namespace shippingData {
            export namespace country {
                export const code: string;
            }
            export namespace region {
                export const id: any;
            }
        }
    }
    export namespace propTypes {
        export { func as afterSubmit };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            field: import("prop-types").Requireable<string>;
            email: import("prop-types").Requireable<string>;
            firstname: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
            country: import("prop-types").Requireable<string>;
            street0: import("prop-types").Requireable<string>;
            street1: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            region: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            telephone: import("prop-types").Requireable<string>;
            buttons: import("prop-types").Requireable<string>;
            submit: import("prop-types").Requireable<string>;
            submit_update: import("prop-types").Requireable<string>;
            formMessage: import("prop-types").Requireable<string>;
            defaultShipping: import("prop-types").Requireable<string>;
        }>>;
        export { func as onCancel };
        const shippingData_1: import("prop-types").Requireable<import("prop-types").InferProps<{
            city: import("prop-types").Requireable<string>;
            country: import("prop-types").Validator<import("prop-types").InferProps<{
                code: import("prop-types").Validator<string>;
            }>>;
            default_shipping: import("prop-types").Requireable<boolean>;
            email: import("prop-types").Requireable<string>;
            firstname: import("prop-types").Requireable<string>;
            id: import("prop-types").Requireable<number>;
            lastname: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            region: import("prop-types").Validator<import("prop-types").InferProps<{
                id: import("prop-types").Requireable<number>;
            }>>;
            street: import("prop-types").Requireable<string[]>;
            telephone: import("prop-types").Requireable<string>;
        }>>;
        export { shippingData_1 as shippingData };
    }
}
import { func } from "prop-types";
