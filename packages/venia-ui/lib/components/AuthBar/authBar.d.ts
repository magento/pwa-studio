export default AuthBar;
declare function AuthBar(props: any): JSX.Element;
declare namespace AuthBar {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export { bool as disabled };
        export const showMyAccount: import("prop-types").Validator<(...args: any[]) => any>;
        export const showSignIn: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { bool } from "prop-types";
