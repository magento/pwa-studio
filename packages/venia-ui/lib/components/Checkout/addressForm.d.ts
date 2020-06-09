export default AddressForm;
declare function AddressForm(props: any): JSX.Element;
declare namespace AddressForm {
    export namespace propTypes {
        export const onCancel: import("prop-types").Validator<(...args: any[]) => any>;
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            button: import("prop-types").Requireable<string>;
            city: import("prop-types").Requireable<string>;
            email: import("prop-types").Requireable<string>;
            firstname: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            lastname: import("prop-types").Requireable<string>;
            postcode: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            region_code: import("prop-types").Requireable<string>;
            street0: import("prop-types").Requireable<string>;
            telephone: import("prop-types").Requireable<string>;
            validation: import("prop-types").Requireable<string>;
        }>>;
        export { array as countries };
        export { bool as isSubmitting };
        export const onSubmit: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { array } from "prop-types";
import { bool } from "prop-types";
