export default ForgotPasswordForm;
declare function ForgotPasswordForm(props: any): JSX.Element;
declare namespace ForgotPasswordForm {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            form: import("prop-types").Requireable<string>;
            buttonContainer: import("prop-types").Requireable<string>;
        }>>;
        export const initialValues: import("prop-types").Requireable<import("prop-types").InferProps<{
            email: import("prop-types").Requireable<string>;
        }>>;
        export const onSubmit: import("prop-types").Validator<(...args: any[]) => any>;
    }
    export namespace defaultProps {
        const initialValues_1: {};
        export { initialValues_1 as initialValues };
    }
}
