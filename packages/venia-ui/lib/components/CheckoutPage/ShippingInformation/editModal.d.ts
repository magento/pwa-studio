export default EditModal;
declare function EditModal(props: any): JSX.Element;
declare namespace EditModal {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_open: import("prop-types").Requireable<string>;
            body: import("prop-types").Requireable<string>;
            header: import("prop-types").Requireable<string>;
            headerText: import("prop-types").Requireable<string>;
        }>>;
        export { object as shippingData };
    }
}
import { object } from "prop-types";
