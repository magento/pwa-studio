export default ForgotPassword;
declare function ForgotPassword(props: any): JSX.Element;
declare namespace ForgotPassword {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            instructions: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
        }>>;
        export { string as email };
        export const initialValues: import("prop-types").Requireable<import("prop-types").InferProps<{
            email: import("prop-types").Requireable<string>;
        }>>;
        export const onClose: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
import { string } from "prop-types";
