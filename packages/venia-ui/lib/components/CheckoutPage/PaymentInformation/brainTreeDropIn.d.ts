export default BraintreeDropin;
/**
 * This BraintreeDropin component has two purposes which lend to its
 * implementation:
 *
 * 1) Mount and asynchronously create the dropin via the braintree api.
 * 2) On submission (triggered by a parent), request the payment nonce.
 */
declare function BraintreeDropin(props: any): JSX.Element;
declare namespace BraintreeDropin {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            error: import("prop-types").Requireable<string>;
        }>>;
        export { string as containerId };
        export const onError: import("prop-types").Validator<(...args: any[]) => any>;
        export const onReady: import("prop-types").Validator<(...args: any[]) => any>;
        export const onSuccess: import("prop-types").Validator<(...args: any[]) => any>;
        export const shouldRequestPaymentNonce: import("prop-types").Validator<boolean>;
    }
}
import { string } from "prop-types";
