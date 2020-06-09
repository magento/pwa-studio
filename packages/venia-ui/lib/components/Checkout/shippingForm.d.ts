export default ShippingForm;
declare function ShippingForm(props: any): JSX.Element;
declare namespace ShippingForm {
    export namespace propTypes {
        export const availableShippingMethods: import("prop-types").Validator<any[]>;
        export const onCancel: import("prop-types").Validator<(...args: any[]) => any>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            button: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            shippingMethod: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isSubmitting };
        export { string as shippingMethod };
        export const onSubmit: import("prop-types").Validator<(...args: any[]) => any>;
        export { bool as submitting };
    }
    export namespace defaultProps {
        const availableShippingMethods_1: {}[];
        export { availableShippingMethods_1 as availableShippingMethods };
    }
}
import { bool } from "prop-types";
import { string } from "prop-types";
