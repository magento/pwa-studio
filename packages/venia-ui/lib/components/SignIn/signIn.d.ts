export default SignIn;
declare function SignIn(props: any): JSX.Element;
declare namespace SignIn {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            createAccountButton: import("prop-types").Requireable<string>;
            form: import("prop-types").Requireable<string>;
            forgotPasswordButton: import("prop-types").Requireable<string>;
            forgotPasswordButtonRoot: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            signInButton: import("prop-types").Requireable<string>;
            signInDivider: import("prop-types").Requireable<string>;
            signInError: import("prop-types").Requireable<string>;
        }>>;
        export const setDefaultUsername: import("prop-types").Validator<(...args: any[]) => any>;
        export const showCreateAccount: import("prop-types").Validator<(...args: any[]) => any>;
        export const showForgotPassword: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
