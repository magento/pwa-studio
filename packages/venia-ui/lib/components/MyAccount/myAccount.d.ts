export default MyAccount;
declare function MyAccount(props: any): JSX.Element;
declare namespace MyAccount {
    export namespace propTypes {
        export const classes: import("prop-types").Requireable<import("prop-types").InferProps<{
            actions: import("prop-types").Requireable<string>;
            root: import("prop-types").Requireable<string>;
            subtitle: import("prop-types").Requireable<string>;
            title: import("prop-types").Requireable<string>;
            user: import("prop-types").Requireable<string>;
        }>>;
        export const onSignOut: import("prop-types").Validator<(...args: any[]) => any>;
    }
}
