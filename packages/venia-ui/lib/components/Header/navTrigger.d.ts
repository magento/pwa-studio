export default NavigationTrigger;
/**
 * A component that toggles the navigation menu.
 */
declare function NavigationTrigger(props: any): JSX.Element;
declare namespace NavigationTrigger {
    export namespace propTypes {
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
    }
}
import { node } from "prop-types";
