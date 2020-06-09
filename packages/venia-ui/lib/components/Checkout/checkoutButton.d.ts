export default CheckoutButton;
declare function CheckoutButton(props: any): JSX.Element;
declare namespace CheckoutButton {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            icon: import("prop-types").Requireable<string>;
        }>>;
        export { bool as disabled };
        export { func as onClick };
    }
}
import { bool } from "prop-types";
import { func } from "prop-types";
