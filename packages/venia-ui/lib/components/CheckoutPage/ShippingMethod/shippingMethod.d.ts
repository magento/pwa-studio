export default ShippingMethod;
declare function ShippingMethod(props: any): JSX.Element;
declare namespace ShippingMethod {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            done: import("prop-types").Requireable<string>;
            editingHeading: import("prop-types").Requireable<string>;
            form: import("prop-types").Requireable<string>;
            formButtons: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export const onSave: import("prop-types").Validator<(...args: any[]) => any>;
        export { bool as pageIsUpdating };
        export const setPageIsUpdating: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { bool } from "prop-types";
