export default Message;
declare function Message(props: any): JSX.Element;
declare namespace Message {
    export namespace defaultProps {
        export const fieldState: {};
    }
    export namespace propTypes {
        export { node as children };
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
            root_error: import("prop-types").Requireable<string>;
        }>>;
        const fieldState_1: import("prop-types").Requireable<import("prop-types").InferProps<{
            asyncError: import("prop-types").Requireable<string>;
            error: import("prop-types").Requireable<string>;
        }>>;
        export { fieldState_1 as fieldState };
    }
}
import { node } from "prop-types";
