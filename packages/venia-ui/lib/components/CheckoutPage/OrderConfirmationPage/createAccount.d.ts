export default CreateAccount;
declare function CreateAccount(props: any): JSX.Element;
declare namespace CreateAccount {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            actions: import("prop-types").Requireable<string>;
            error: import("prop-types").Requireable<string>;
            form: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            subscribe: import("prop-types").Requireable<string>;
        }>>;
        export const initialValues: import("prop-types").Requireable<import("prop-types").InferProps<{
            email: import("prop-types").Requireable<string>;
            firstName: import("prop-types").Requireable<string>;
            lastName: import("prop-types").Requireable<string>;
        }>>;
        export { func as onSubmit };
    }
}
import { func } from "prop-types";
