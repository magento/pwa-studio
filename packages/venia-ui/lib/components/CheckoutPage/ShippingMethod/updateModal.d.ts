export default UpdateModal;
declare function UpdateModal(props: any): JSX.Element;
declare namespace UpdateModal {
    export namespace propTypes {
        export { object as formInitialValues };
        export { func as handleCancel };
        export { func as handleSubmit };
        export { bool as isLoading };
        export { bool as isOpen };
        export { bool as pageIsUpdating };
        export const shippingMethods: import("prop-types").Requireable<import("prop-types").InferProps<{
            amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                currency: import("prop-types").Requireable<string>;
                value: import("prop-types").Requireable<number>;
            }>>;
            available: import("prop-types").Requireable<boolean>;
            carrier_code: import("prop-types").Requireable<string>;
            carrier_title: import("prop-types").Requireable<string>;
            method_code: import("prop-types").Requireable<string>;
            method_title: import("prop-types").Requireable<string>;
            serializedValue: import("prop-types").Validator<string>;
        }>[]>;
    }
}
import { object } from "prop-types";
import { func } from "prop-types";
import { bool } from "prop-types";
