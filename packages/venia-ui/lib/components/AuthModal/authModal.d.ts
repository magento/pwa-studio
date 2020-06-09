export default AuthModal;
declare function AuthModal(props: any): JSX.Element;
declare namespace AuthModal {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            root: import("prop-types").Requireable<string>;
        }>>;
        export const showCreateAccount: import("prop-types").Validator<(...args: any[]) => any>;
        export const showForgotPassword: import("prop-types").Validator<(...args: any[]) => any>;
        export const showMainMenu: import("prop-types").Validator<(...args: any[]) => any>;
        export const showMyAccount: import("prop-types").Validator<(...args: any[]) => any>;
        export const view: import("prop-types").Validator<string>;
    }
}
