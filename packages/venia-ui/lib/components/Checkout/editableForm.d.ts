export default EditableForm;
/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */
declare function EditableForm(props: any): JSX.Element;
declare namespace EditableForm {
    export namespace propTypes {
        export { array as availableShippingMethods };
        export const editing: import("prop-types").Requireable<string>;
        export { bool as isSubmitting };
        export const setEditing: import("prop-types").Validator<(...args: any[]) => any>;
        export { object as shippingAddress };
        export { string as shippingMethod };
        export const submitShippingMethod: import("prop-types").Validator<(...args: any[]) => any>;
        export const submitPaymentMethodAndBillingAddress: import("prop-types").Validator<(...args: any[]) => any>;
        export const checkout: import("prop-types").Validator<import("prop-types").InferProps<{
            countries: import("prop-types").Requireable<any[]>;
        }>>;
    }
}
import { array } from "prop-types";
import { bool } from "prop-types";
import { object } from "prop-types";
import { string } from "prop-types";
