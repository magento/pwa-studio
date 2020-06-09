export default Flow;
/**
 * This Flow component's primary purpose is to take relevant state and actions
 * and pass them to the current checkout step.
 */
declare function Flow(props: any): JSX.Element;
declare namespace Flow {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { func as setStep };
        export { string as step };
    }
}
import { func } from "prop-types";
import { string } from "prop-types";
