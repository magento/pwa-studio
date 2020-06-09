export default Receipt;
/**
 * A component that displays some basic information about an order and has
 * a call to action for viewing order details and creating an account.
 */
declare function Receipt(props: any): JSX.Element;
declare namespace Receipt {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            body: import("prop-types").Requireable<string>;
            footer: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as drawer };
        export const onClose: import("prop-types").Validator<(...args: any[]) => any>;
        export const order: import("prop-types").Validator<import("prop-types").InferProps<{
            id: import("prop-types").Requireable<string>;
        }>>;
    }
    export namespace defaultProps {
        const order_1: {};
        export { order_1 as order };
    }
}
import { string } from "prop-types";
