export default OnlineIndicator;
/**
 * Renders an online indicator when the app goes offline.
 */
declare function OnlineIndicator(props: any): JSX.Element;
declare namespace OnlineIndicator {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { bool as isOnline };
        export { bool as hasBeenOffline };
    }
}
import { bool } from "prop-types";
