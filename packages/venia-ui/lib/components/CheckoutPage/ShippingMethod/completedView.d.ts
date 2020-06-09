export default CompletedView;
declare function CompletedView(props: any): JSX.Element;
declare namespace CompletedView {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            button: import("prop-types").Requireable<string>;
            container: import("prop-types").Requireable<string>;
            contents: import("prop-types").Requireable<string>;
            editButton: import("prop-types").Requireable<string>;
            editButtonText: import("prop-types").Requireable<string>;
            error: import("prop-types").Requireable<string>;
            free: import("prop-types").Requireable<string>;
            heading: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            titleContainer: import("prop-types").Requireable<string>;
        }>>;
        export const selectedShippingMethod: import("prop-types").Requireable<import("prop-types").InferProps<{
            amount: import("prop-types").Requireable<import("prop-types").InferProps<{
                currency: import("prop-types").Requireable<string>;
                value: import("prop-types").Requireable<number>;
            }>>;
            carrier_code: import("prop-types").Requireable<string>;
            carrier_title: import("prop-types").Requireable<string>;
            method_code: import("prop-types").Requireable<string>;
            method_title: import("prop-types").Requireable<string>;
        }>>;
        export { func as showUpdateMode };
    }
}
import { func } from "prop-types";
